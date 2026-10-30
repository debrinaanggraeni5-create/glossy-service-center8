* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(34, 211, 238, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.2), transparent 25%),
    linear-gradient(135deg, #050b1a 0%, #0b1120 30%, #111827 100%);
  color: #e5eefb;
}

body.admin-body {
  min-height: 100vh;
}

img {
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

.page-shell,
.admin-shell {
  min-height: 100vh;
}

.container {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
}

.section-space {
  padding: 110px 0;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(18px);
  background: rgba(7, 11, 20, 0.55);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 82px;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 800;
  background: linear-gradient(135deg, #7c3aed, #22d3ee);
  box-shadow: 0 10px 30px rgba(34, 211, 238, 0.35);
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  letter-spacing: 0.04em;
}

.brand small {
  opacity: 0.8;
  font-size: 0.7rem;
}

.nav-links {
  display: flex;
  gap: 20px;
  color: rgba(226, 232, 240, 0.8);
}

.nav-links a {
  transition: opacity 0.2s ease;
}

.nav-links a:hover {
  opacity: 1;
}

.button {
  border: none;
  border-radius: 999px;
  padding: 0.9rem 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button-primary {
  background: linear-gradient(135deg, #7c3aed, #22d3ee);
  color: white;
  box-shadow: 0 14px 30px rgba(124, 58, 237, 0.35);
}

.button-secondary {
  background: rgba(148, 163, 184, 0.12);
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.button.small {
  padding: 0.65rem 1rem;
  font-size: 0.85rem;
}

.full-width {
  width: 100%;
}

.hero {
  position: relative;
  background-image:
    linear-gradient(90deg, rgba(8, 10, 18, 0.82), rgba(16, 20, 35, 0.52)),
    url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  padding: 120px 0 80px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 24px;
  align-items: center;
}

.eyebrow {
  display: inline-flex;
  padding: 0.46rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(34, 211, 238, 0.35);
  background: rgba(18, 24, 39, 0.65);
  color: #7dd3fc;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
}

.hero-copy h1 {
  margin: 20px 0 18px;
  font-size: clamp(2.8rem, 5vw, 5rem);
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.hero-copy p {
  max-width: 620px;
  color: rgba(226, 232, 240, 0.78);
  font-size: 1.12rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

.stats-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 14px;
  margin-top: 36px;
}

.stats-strip > div {
  padding: 18px 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.4);
}

.stats-strip strong,
.stats-strip span {
  display: block;
}

.stats-strip strong {
  font-size: 1.3rem;
  margin-bottom: 4px;
}

.stats-strip span {
  color: rgba(226, 232, 240, 0.7);
  font-size: 0.82rem;
}

.glass-panel {
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.18);
  backdrop-filter: blur(18px);
  box-shadow: 0 28px 50px rgba(15, 23, 42, 0.35);
}

.hero-panel {
  border-radius: 28px;
  padding: 20px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(226, 232, 240, 0.85);
  font-weight: 600;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 18px rgba(52, 211, 153, 0.85);
}

.mini-queue {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 28px;
  gap: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.mini-queue small,
.service-points li,
.field-grid label span,
label span,
.booking-copy p,
.feature-card p,
.queue-item small,
.queue-item p,
.table-wrap td,
.table-wrap th {
  color: rgba(226, 232, 240, 0.75);
}

.mini-queue strong {
  display: block;
  font-size: 2.2rem;
  margin-top: 6px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
}

.status-badge.waiting {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
}

.status-badge.called {
  background: rgba(34, 211, 238, 0.12);
  color: #67e8f9;
}

.status-badge.in_progress {
  background: rgba(168, 85, 247, 0.12);
  color: #d8b4fe;
}

.status-badge.done {
  background: rgba(52, 211, 153, 0.12);
  color: #6ee7b7;
}

.service-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.service-badges span {
  background: rgba(14, 165, 233, 0.12);
  color: #bae6fd;
  border: 1px solid rgba(125, 211, 252, 0.2);
  border-radius: 999px;
  padding: 0.5rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.service-points {
  margin: 26px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 12px;
}

.section-heading {
  margin-bottom: 36px;
}

.section-heading h2 {
  margin: 16px 0 0;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.04em;
}

.service-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.service-card {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.52);
  box-shadow: 0 24px 35px rgba(15, 23, 42, 0.2);
}

.service-image {
  height: 220px;
  background-size: cover;
  background-position: center;
}

.service-info {
  padding: 22px 20px 24px;
}

.service-info h3 {
  margin: 0 0 10px;
  font-size: 1.5rem;
}

.service-price {
  display: inline-block;
  font-size: 1.1rem;
  color: #7dd3fc;
  margin-bottom: 12px;
  font-weight: 800;
}

.service-info p {
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
  line-height: 1.7;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.feature-card {
  border-radius: 24px;
  padding: 28px 22px;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(34, 211, 238, 0.18));
  font-size: 1.8rem;
  margin-bottom: 18px;
}

.feature-card h3 {
  margin: 0 0 10px;
  font-size: 1.45rem;
}

.feature-card p {
  margin: 0;
  line-height: 1.7;
}

.booking-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  align-items: center;
}

.booking-copy h2 {
  margin: 18px 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.04em;
}

.booking-copy p {
  line-height: 1.8;
  font-size: 1.05rem;
}

.booking-form {
  border-radius: 28px;
  padding: 24px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

label {
  display: grid;
  gap: 8px;
  width: 100%;
}

input,
select,
textarea {
  width: 100%;
  background: rgba(15, 23, 42, 0.7);
  color: white;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 0.95rem 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: rgba(34, 211, 238, 0.7);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15);
}

textarea {
  resize: vertical;
}

.cost-box {
  margin: 20px 0;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
}

.cost-box strong {
  font-size: 1.15rem;
  color: #7dd3fc;
}

.queue-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.queue-item {
  border-radius: 22px;
  padding: 18px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 24px 30px rgba(15, 23, 42, 0.22);
}

.queue-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.queue-number {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #7dd3fc;
}

.queue-item p {
  margin: 14px 0 0;
  line-height: 1.6;
}

.queue-item small {
  display: block;
}

.toast {
  position: fixed;
  bottom: 22px;
  right: 22px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 14px;
  max-width: 360px;
  padding: 0.9rem 1rem;
  color: #e2e8f0;
  backdrop-filter: blur(14px);
  transform: translateY(120%);
  opacity: 0;
  transition: transform 0.22s ease, opacity 0.22s ease;
  z-index: 120;
}

.toast.visible {
  transform: translateY(0);
  opacity: 1;
}

.admin-shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
}

.admin-sidebar {
  padding: 22px 18px;
  border-radius: 0 28px 28px 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-brand {
  padding: 8px 6px;
}

.admin-nav {
  display: grid;
  gap: 10px;
}

.nav-action {
  width: 100%;
  text-align: left;
  padding: 0.8rem 0.9rem;
  border-radius: 14px;
  color: rgba(226, 232, 240, 0.8);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.nav-action.is-active,
.nav-action:hover {
  background: rgba(34, 211, 238, 0.08);
  border-color: rgba(34, 211, 238, 0.25);
}

.admin-content {
  padding: 32px;
}

.auth-screen {
  min-height: calc(100vh - 64px);
  display: grid;
  place-items: center;
}

.auth-card {
  width: min(440px, 100%);
  border-radius: 28px;
  padding: 30px 24px;
}

.auth-card h2 {
  margin: 16px 0 20px;
  font-size: clamp(2rem, 4vw, 2.5rem);
}

.hidden {
  display: none !important;
}

.dashboard {
  display: block;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.dashboard-header h2 {
  margin: 10px 0 0;
  font-size: clamp(2rem, 4vw, 2.7rem);
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.overview-card {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 20px;
  padding: 18px;
}

.overview-card h4 {
  margin: 0 0 14px;
  color: rgba(226, 232, 240, 0.7);
  font-weight: 600;
}

.overview-card strong {
  font-size: 2rem;
  letter-spacing: -0.05em;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1.15fr 1.85fr;
  gap: 24px;
}

.admin-section {
  border-radius: 24px;
  padding: 22px;
}

.admin-section[data-panel='transactions'] {
  grid-column: 1 / -1;
}

.section-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-top h3 {
  margin: 0;
  font-size: 1.35rem;
}

.admin-form {
  display: grid;
  gap: 16px;
  margin-bottom: 18px;
}

.field-grid.compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-wrap {
  overflow: auto;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  vertical-align: top;
}

.table-wrap th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(191, 219, 254, 0.7);
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  border: none;
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.1);
  color: #e2e8f0;
  padding: 0.5rem 0.7rem;
  cursor: pointer;
}

.action-btn.primary {
  background: rgba(34, 211, 238, 0.12);
  color: #67e8f9;
}

.action-btn.danger {
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
}

.select-status {
  min-width: 130px;
}

.receipt-wrap {
  max-width: 460px;
  margin: 30px auto;
  background: white;
  color: #0f172a;
  border-radius: 22px;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.2);
  padding: 28px;
}

.receipt-wrap .brand {
  color: #0f172a;
  margin-bottom: 16px;
}

.receipt-wrap h2 {
  margin: 0 0 18px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.receipt-row strong {
  color: #0f172a;
}

.receipt-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

@media (max-width: 980px) {
  .hero-grid,
  .booking-grid,
  .admin-grid,
  .service-cards,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .navbar {
    flex-wrap: wrap;
    justify-content: center;
    padding: 12px 0;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .admin-shell {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    min-height: unset;
    border-radius: 0;
  }
}

@media (max-width: 640px) {
  .field-grid,
  .field-grid.compact,
  .overview-cards {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 90px;
  }

  .section-space {
    padding: 80px 0;
  }

  .topbar {
    position: static;
  }

  .stats-strip {
    grid-template-columns: 1fr;
  }
}
