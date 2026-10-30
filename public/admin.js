const serviceSelect = document.getElementById('serviceSelect');
const estimatedCost = document.getElementById('estimatedCost');
const bookingForm = document.getElementById('bookingForm');
const queueList = document.getElementById('queueList');
const toast = document.getElementById('toast');

const socket = io();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}

function currency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
}

function statusLabel(status) {
  const map = {
    waiting: 'Menunggu',
    called: 'Dipanggil',
    in_progress: 'Sedang dikerjakan',
    done: 'Selesai',
  };

  return map[status] || 'Menunggu';
}

function statusClass(status) {
  return `status-badge ${status}`;
}

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Operasi gagal.');
  }

  return data;
}

async function loadServices() {
  const services = await fetchJSON('/api/services');

  serviceSelect.innerHTML = services
    .map((service) => `<option value="${service.id}">${service.name} - ${currency(service.price)}</option>`)
    .join('');

  if (services.length > 0) {
    updateEstimatedCost();
  }
}

function updateEstimatedCost() {
  const selectedService = serviceSelect.options[serviceSelect.selectedIndex];
  if (!selectedService) {
    estimatedCost.textContent = currency(0);
    return;
  }

  const serviceValue = selectedService.textContent;
  const match = serviceValue.match(/Rp[\d.,]+/);
  estimatedCost.textContent = match ? match[0] : currency(0);
}

function renderQueue(bookings) {
  if (!bookings || bookings.length === 0) {
    queueList.innerHTML = '<div class="glass-panel queue-item"><p>Belum ada antrean.</p></div>';
    document.getElementById('currentQueueLabel').textContent = 'A000';
    return;
  }

  const sorted = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  queueList.innerHTML = sorted
    .slice(0, 6)
    .map((booking) => `
      <article class="queue-item">
        <div class="queue-item-header">
          <span class="queue-number">${booking.queue_number || 'A000'}</span>
          <span class="${statusClass(booking.status || 'waiting')}">${statusLabel(booking.status || 'waiting')}</span>
        </div>
        <small>${booking.name}</small>
        <p>
          <strong>${booking.service_name || 'Layanan'}</strong><br />
          ${booking.device_type || '-'}<br />
          ${currency(booking.estimated_cost || booking.service_price || 0)}
        </p>
      </article>
    `)
    .join('');

  const current = bookings[0];
  document.getElementById('currentQueueLabel').textContent = current?.queue_number || 'A000';
}

async function loadQueue() {
  const bookings = await fetchJSON('/api/bookings');
  renderQueue(bookings);
}

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const payload = {
    name: formData.get('name').toString().trim(),
    phone: formData.get('phone').toString().trim(),
    serviceId: formData.get('serviceId'),
    deviceType: formData.get('deviceType').toString().trim(),
    complaint: formData.get('complaint').toString().trim(),
  };

  try {
    const result = await fetchJSON('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const messageText = encodeURIComponent(
      `Halo Admin Glossy Service Center,%0A` +
        `Nama: ${payload.name}%0A` +
        `Layanan: ${result.booking.service_name}%0A` +
        `Perangkat: ${payload.deviceType}%0A` +
        `Nomor Antrean: ${result.booking.queue_number}%0A` +
        `Estimasi Biaya: ${currency(result.booking.estimated_cost || result.booking.service_price || 0)}%0A` +
        `Keluhan: ${payload.complaint}`
    );

    window.open(`https://wa.me/6289636876329?text=${messageText}`, '_blank');
    showToast(result.message || 'Booking berhasil dibuat.');
    bookingForm.reset();
    await loadServices();
    await loadQueue();
  } catch (error) {
    showToast(error.message || 'Booking gagal dibuat.');
  }
});

serviceSelect.addEventListener('change', updateEstimatedCost);

socket.on('queue:update', (payload) => {
  renderQueue(payload.bookings || []);
});

socket.on('queue:call', (payload) => {
  const voiceText = `Mohon perhatian, antrean nomor ${payload.queue_number}, silakan menuju meja pelayanan.`;
  showToast(payload.message || voiceText);

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);

  oscillator.connect(gainNode).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
});

(async () => {
  try {
    await loadServices();
    await loadQueue();
  } catch (error) {
    console.error('Gagal memuat data awal:', error);
  }
})();
