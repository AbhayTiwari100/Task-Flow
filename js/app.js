/* ══════════════════════════════════════
   app.js — App Controller & UI Utilities
   ══════════════════════════════════════ */

/* ── UI Utilities ── */
const UI = {
  /** Show a temporary toast notification */
  toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  },

  /** Format an ISO date string to human-readable */
  formatDate(d) {
    if (!d) return '';
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },
};

/* ── App Controller ── */
const App = {
  /** Route to the correct view based on logged-in user role */
  render() {
    const user = Auth.currentUser();
    if (!user) return;

    if (user.role === 'admin') {
      AdminView.render();
    } else {
      EmployeeView.render();
    }
  },
};

/* ── Boot ── */
(function init() {
  // Pre-fill login defaults
  Auth.selectRole('admin');
})();
