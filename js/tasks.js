/* ══════════════════════════════════════
   tasks.js — Task Actions: Create, Edit, Delete, Status
   ══════════════════════════════════════ */

const Tasks = (() => {
  let _editingId = null;

  function clearEditing() { _editingId = null; }

  /* ── Open "Create Task" modal ── */
  function openCreateModal() {
    _editingId = null;
    Modal.open(`
      <div class="modal-title">✦ Create New Task</div>

      <div class="form-group">
        <label class="form-label">Task Title *</label>
        <input class="form-input" id="mTitle" placeholder="e.g. Design homepage banner"/>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="mDesc" placeholder="What needs to be done?"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="mPriority">
            <option value="low">🟢 Low</option>
            <option value="medium" selected>🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Due Date</label>
          <input class="form-input" type="date" id="mDue"/>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Assign To</label>
        <div class="emp-chips">${Modal.buildEmployeeChips()}</div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="Tasks.save()">Create Task</button>
      </div>
    `);
  }

  /* ── Open "Edit Task" modal ── */
  function openEditModal(id) {
    _editingId = id;
    const task = Storage.getTasks().find(t => t.id === id);
    if (!task) return;

    Modal.open(`
      <div class="modal-title">✏️ Edit Task</div>

      <div class="form-group">
        <label class="form-label">Task Title *</label>
        <input class="form-input" id="mTitle" value="${task.title}"/>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="mDesc">${task.desc || ''}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="mPriority">
            <option value="low"    ${task.priority === 'low'    ? 'selected' : ''}>🟢 Low</option>
            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>🟡 Medium</option>
            <option value="high"   ${task.priority === 'high'   ? 'selected' : ''}>🔴 High</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="mStatus">
            <option value="todo"     ${task.status === 'todo'     ? 'selected' : ''}>📋 To Do</option>
            <option value="progress" ${task.status === 'progress' ? 'selected' : ''}>⚡ In Progress</option>
            <option value="done"     ${task.status === 'done'     ? 'selected' : ''}>✅ Done</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Due Date</label>
          <input class="form-input" type="date" id="mDue" value="${task.due || ''}"/>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Assign To</label>
        <div class="emp-chips">${Modal.buildEmployeeChips(task.assignee)}</div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="Tasks.save()">Save Changes</button>
      </div>
    `);
  }

  /* ── Save (create or update) ── */
  function save() {
    const title = document.getElementById('mTitle').value.trim();
    if (!title) { UI.toast('❌ Title is required'); return; }

    const desc     = document.getElementById('mDesc').value.trim();
    const priority = document.getElementById('mPriority').value;
    const due      = document.getElementById('mDue').value;
    const statusEl = document.getElementById('mStatus');
    const status   = statusEl ? statusEl.value : 'todo';
    const chipSel  = document.querySelector('.emp-chip.selected');
    const assignee = chipSel ? chipSel.dataset.id : '';

    if (_editingId) {
      Storage.updateTask(_editingId, { title, desc, priority, due, status, assignee });
      UI.toast('✅ Task updated');
    } else {
      Storage.createTask({ title, desc, priority, due, assignee });
      UI.toast('✅ Task created');
    }

    Modal.close();
    App.render();
  }

  /* ── Change status directly from card buttons ── */
  function changeStatus(id, status) {
    Storage.updateTask(id, { status });
    UI.toast('Status updated');
    App.render();
  }

  /* ── Delete task ── */
  function remove(id) {
    if (!confirm('Delete this task?')) return;
    Storage.deleteTask(id);
    UI.toast('🗑 Task deleted');
    App.render();
  }

  return { openCreateModal, openEditModal, save, changeStatus, remove, clearEditing };
})();
