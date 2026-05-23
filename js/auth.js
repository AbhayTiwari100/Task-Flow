/* ══════════════════════════════════════
   auth.js — Authentication (Login / Logout / Role)
   ══════════════════════════════════════ */

const Auth = (() => {
  let _currentUser = null;
  let _selectedRole = 'admin';

  /** Get currently logged-in user */
  function currentUser() {
    return _currentUser;
  }

  /** Switch the role tab on the login screen */
  function selectRole(role) {
    _selectedRole = role;

    // Update tab UI
    document.querySelectorAll('.role-tab').forEach((tab, i) => {
      tab.classList.toggle('active', (role === 'admin' && i === 0) || (role === 'employee' && i === 1));
    });

    // Pre-fill demo credentials
    document.getElementById('loginUser').value = role === 'admin' ? 'admin' : 'alice';
    document.getElementById('loginPass').value = role === 'admin' ? 'admin123' : 'pass123';
  }

  /** Attempt login */
  function login() {
    const username = document.getElementById('loginUser').value.trim().toLowerCase();
    const password = document.getElementById('loginPass').value;
    const userRecord = USERS[username];

    if (!userRecord || userRecord.pass !== password) {
      UI.toast('❌ Invalid username or password');
      return;
    }

    _currentUser = { id: username, ...userRecord };

    // Show app
    document.getElementById('loginScreen').style.display = 'none';
    const app = document.getElementById('app');
    app.style.display = 'flex';
    app.style.flexDirection = 'column';

    // Set topbar info
    document.getElementById('topbarUser').textContent = userRecord.name;
    const roleTag = document.getElementById('roleTag');
    roleTag.textContent = userRecord.role === 'admin' ? 'Admin' : 'Employee';
    roleTag.className = 'topbar-role ' + (userRecord.role === 'admin' ? 'role-admin' : 'role-employee');

    // Seed data & render
    Storage.initDefaults();
    App.render();
  }

  /** Log out and reset to login screen */
  function logout() {
    _currentUser = null;

    document.getElementById('app').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';

    // Reset login form
    selectRole('admin');
  }

  return { currentUser, selectRole, login, logout };
})();
