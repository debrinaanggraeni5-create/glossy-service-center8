function currency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
}

async function loadReceipt() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('receiptContent').innerHTML = '<p>Struk tidak tersedia.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/receipt/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Struk tidak ditemukan.');
    }

    const content = `
      <div class="receipt-row">
        <span>Nama pelanggan</span>
        <strong>${data.name}</strong>
      </div>
      <div class="receipt-row">
        <span>Nomor antrean</span>
        <strong>${data.queue_number}</strong>
      </div>
      <div class="receipt-row">
        <span>Jenis layanan</span>
        <strong>${data.service_name || '-'}</strong>
      </div>
      <div class="receipt-row">
        <span>Jenis perangkat</span>
        <strong>${data.device_type || '-'}</strong>
      </div>
      <div class="receipt-row">
        <span>Keluhan</span>
        <strong>${data.complaint || '-'}</strong>
      </div>
      <div class="receipt-row">
        <span>Detail biaya</span>
        <strong>${currency(data.estimated_cost || data.service_price || 0)}</strong>
      </div>
      <div class="receipt-row">
        <span>Total pembayaran</span>
        <strong>${currency(data.estimated_cost || data.service_price || 0)}</strong>
      </div>
      <div class="receipt-row">
        <span>Tanggal transaksi</span>
        <strong>${new Date(data.created_at).toLocaleString('id-ID')}</strong>
      </div>
    `;

    document.getElementById('receiptContent').innerHTML = content;
  } catch (error) {
    document.getElementById('receiptContent').innerHTML = `<p>${error.message}</p>`;
  }
}

document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

loadReceipt();
