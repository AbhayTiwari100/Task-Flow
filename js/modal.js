/* ══════════════════════════════════════
   modal.js — Modal Open / Close / Render
   ══════════════════════════════════════ */

const Modal = (() => {
  const overlay = () => document.getElementById('modalOverlay');
  const box     = () => document.getElementById('modalBox');

  /** Open modal with given HTML content */
  function open(html) {
    box().innerHTML = html;
    overlay().classList.add('open');
  }

  /** Close modal */
  function close() {
    overlay().classList.remove('open');
    box().innerHTML = '';
    Tasks.clearEditing();
  }

  /** Close modal only when clicking the dark overlay (not the card) */
  function closeOnOverlay(e) {
    if (e.target === overlay()) close();
  }

  /** Handle employee chip selection inside modal */
  function selectEmployee(el, id) {
    document.querySelectorAll('.emp-chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
  }

  /** Build the employee chips HTML */
  function buildEmployeeChips(selectedId = '') {
    return EMPLOYEES.map(e => `
      <div class="emp-chip ${selectedId === e.id ? 'selected' : ''}"
           data-id="${e.id}"
           onclick="Modal.selectEmployee(this, '${e.id}')">
        ${e.name}
      </div>
    `).join('');
  }

  return { open, close, closeOnOverlay, selectEmployee, buildEmployeeChips };
})();
