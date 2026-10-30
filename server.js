const express = require('express');
const http = require('http');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'service_center.db');

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(DB_PATH, (error) => {
  if (error) {
    console.error('Gagal membuka database SQLite:', error.message);
    process.exit(1);
  }
  console.log('Database siap di:', DB_PATH);
});

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function getAllBookings() {
  return allQuery(`
    SELECT b.*, s.name AS service_name, s.price AS service_price
    FROM bookings b
    LEFT JOIN services s ON s.id = b.service_id
    ORDER BY b.id DESC
  `);
}

async function broadcastQueueUpdate() {
  const bookings = await getAllBookings();
  io.emit('queue:update', { bookings });
}

async function ensureDatabase() {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      service_id INTEGER,
      device_type TEXT,
      complaint TEXT,
      queue_number TEXT UNIQUE,
      status TEXT DEFAULT 'waiting',
      estimated_cost INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      transaction_code TEXT,
      FOREIGN KEY(service_id) REFERENCES services(id)
    )
  `);

  const services = await allQuery('SELECT * FROM services');
  if (services.length === 0) {
    await runQuery(
      `INSERT INTO services (name, price, description) VALUES
       ('Service Handphone', 50000, 'Perbaikan HP, ganti layar, baterai, dan software'),
       ('Service Laptop/PC', 75000, 'Diagnosa laptop, PC, dan perangkat kerja digital'),
       ('Service Jaringan', 35000, 'Perbaikan jaringan Wi-Fi, kabel, dan perangkat jaringan')`
    );
  }
}

function getTransactionCode() {
  const date = new Date();
  const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TRX-${timestamp}-${random}`;
}

async function getNextQueueNumber() {
  const row = await getQuery(`
    SELECT MAX(CAST(SUBSTR(queue_number, 2) AS INTEGER)) AS max_number
    FROM bookings
    WHERE queue_number LIKE 'A%'
  `);

  const nextNumber = Number(row?.max_number || 0) + 1;
  return `A${String(nextNumber).padStart(3, '0')}`;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Server aktif.', timestamp: new Date().toISOString() });
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await allQuery('SELECT * FROM services ORDER BY id ASC');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat layanan.', error: error.message });
  }
});

app.post('/api/services', async (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Nama layanan dan harga wajib diisi.' });
  }

  try {
    const result = await runQuery(
      'INSERT INTO services (name, price, description) VALUES (?, ?, ?)',
      [name, Number(price), description || '']
    );
    const service = await getQuery('SELECT * FROM services WHERE id = ?', [result.id]);
    res.json({ ok: true, service });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambah layanan.', error: error.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  const { name, price, description } = req.body;

  try {
    await runQuery(
      'UPDATE services SET name = ?, price = ?, description = ? WHERE id = ?',
      [name, Number(price), description || '', req.params.id]
    );
    const service = await getQuery('SELECT * FROM services WHERE id = ?', [req.params.id]);
    res.json({ ok: true, service });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui layanan.', error: error.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus layanan.', error: error.message });
  }
});

app.post('/api/admin/login', (req, res) => {
  const pin = String(req.body.pin || '');

  if (pin === ADMIN_PIN) {
    return res.json({ ok: true, message: 'Login berhasil.' });
  }

  return res.status(401).json({ ok: false, message: 'PIN tidak valid.' });
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat antrean.', error: error.message });
  }
});

app.get('/api/receipt/:id', async (req, res) => {
  try {
    const receipt = await getQuery(`
      SELECT b.*, s.name AS service_name, s.price AS service_price
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.id = ?
    `, [req.params.id]);

    if (!receipt) {
      return res.status(404).json({ message: 'Struk tidak ditemukan.' });
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuka struk.', error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { name, phone, serviceId, deviceType, complaint } = req.body;

  if (!name || !phone || !serviceId) {
    return res.status(400).json({ message: 'Nama, nomor WhatsApp, dan layanan wajib diisi.' });
  }

  try {
    const service = await getQuery('SELECT * FROM services WHERE id = ?', [serviceId]);
    if (!service) {
      return res.status(404).json({ message: 'Layanan tidak ditemukan.' });
    }

    const queueNumber = await getNextQueueNumber();
    const estimatedCost = Number(service.price) || 0;
    const transactionCode = getTransactionCode();

    const result = await runQuery(
      `INSERT INTO bookings (name, phone, service_id, device_type, complaint, queue_number, status, estimated_cost, transaction_code)
       VALUES (?, ?, ?, ?, ?, ?, 'waiting', ?, ?)`,
      [name, phone, service.id, deviceType || '-', complaint || '-', queueNumber, estimatedCost, transactionCode]
    );

    const created = await getQuery(`
      SELECT b.*, s.name AS service_name, s.price AS service_price
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.id = ?
    `, [result.id]);

    await broadcastQueueUpdate();
    io.emit('queue:called', {
      queue_number: queueNumber,
      name,
      message: `Antrean ${queueNumber} berhasil ditambahkan.`
    });

    res.json({ ok: true, booking: created, message: `Booking berhasil dibuat. Nomor antrean Anda: ${queueNumber}` });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat booking.', error: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  const { name, phone, serviceId, deviceType, complaint, status } = req.body;

  try {
    await runQuery(
      `UPDATE bookings
       SET name = ?, phone = ?, service_id = ?, device_type = ?, complaint = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, phone, serviceId, deviceType || '-', complaint || '-', status || 'waiting', req.params.id]
    );

    const updated = await getQuery(`
      SELECT b.*, s.name AS service_name, s.price AS service_price
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.id = ?
    `, [req.params.id]);

    await broadcastQueueUpdate();
    res.json({ ok: true, booking: updated });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data antrean.', error: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    await broadcastQueueUpdate();
    res.json({ ok: true, message: 'Antrean berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus antrean.', error: error.message });
  }
});

app.post('/api/bookings/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['waiting', 'called', 'in_progress', 'done'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status yang dikirim tidak valid.' });
  }

  try {
    await runQuery(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.id]
    );

    const updated = await getQuery(`
      SELECT b.*, s.name AS service_name, s.price AS service_price
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.id = ?
    `, [req.params.id]);

    await broadcastQueueUpdate();

    if (status === 'called') {
      io.emit('queue:call', {
        queue_number: updated.queue_number,
        name: updated.name,
        message: `Mohon perhatian, antrean nomor ${updated.queue_number}, silakan menuju meja pelayanan.`
      });
    }

    res.json({ ok: true, booking: updated });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengubah status antrean.', error: error.message });
  }
});

app.post('/api/bookings/call-next', async (req, res) => {
  try {
    const nextBooking = await getQuery(`
      SELECT b.*, s.name AS service_name, s.price AS service_price
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.status != 'done'
      ORDER BY b.id ASC
      LIMIT 1
    `);

    if (!nextBooking) {
      return res.status(404).json({ message: 'Belum ada antrean yang menunggu.' });
    }

    await runQuery(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['called', nextBooking.id]
    );

    const updated = await getQuery(`
      SELECT b.*, s.name AS service_name, s.price AS service_price
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.id = ?
    `, [nextBooking.id]);

    await broadcastQueueUpdate();
    io.emit('queue:call', {
      queue_number: updated.queue_number,
      name: updated.name,
      message: `Mohon perhatian, antrean nomor ${updated.queue_number}, silakan menuju meja pelayanan.`
    });

    res.json({ ok: true, booking: updated, message: `Antrean ${updated.queue_number} dipanggil.` });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memanggil antrean berikutnya.', error: error.message });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/receipt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'receipt.html'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Client terhubung ke Socket.IO');

  socket.on('disconnect', () => {
    console.log('Client terputus dari Socket.IO');
  });
});

async function startServer() {
  await ensureDatabase();

  server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Admin PIN: ${ADMIN_PIN}`);
  });
}

startServer().catch((error) => {
  console.error('Gagal menjalankan server:', error);
  process.exit(1);
});
