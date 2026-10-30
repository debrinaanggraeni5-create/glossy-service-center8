<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Struk Pembayaran Glossy Service Center</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="receipt-wrap">
      <div class="brand">
        <div class="brand-mark">G</div>
        <div>
          <strong>Glossy</strong>
          <small>Service Center</small>
        </div>
      </div>

      <h2>Struk Pembayaran</h2>

      <div id="receiptContent">
        <p>Memuat struk...</p>
      </div>

      <div class="receipt-actions">
        <button id="printBtn" class="button button-primary" type="button">Cetak struk</button>
        <a href="/admin" class="button button-secondary">Kembali ke admin</a>
      </div>
    </main>

    <script src="/receipt.js"></script>
  </body>
</html>
