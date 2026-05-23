/* ══════════════════════════════════════
   admin.js — Admin Dashboard Renderer
   ══════════════════════════════════════ */

const AdminView = (() => {
  let _filter = 'all';
  let _search = '';

  function setFilter(f) { _filter = f; App.render(); }
  function setSearch(q) { _search = q; App.render(); }

  /* ── Apply filter + search ── */
  function _applyFilter(tasks) {
    let out = tasks;

    if (['todo', 'progress', 'done'].includes(_filter))
      out = out.filter(t => t.status === _filter);
    else if (['high', 'medium', 'low'].includes(_filter))
      out = out.filter(t => t.priority === _filter);

    if (_search) {
      const q = _search.toLowerCase();
      out = out.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.desc && t.desc.toLowerCase().includes(q))
      );
    }
    return out;
  }

  /* ── Render full admin page ── */
  function render() {
    const allTasks = Storage.getTasks();
    const filtered = _applyFilter(allTasks);

    const counts = {
      total: allTasks.length,
      todo:  allTasks.filter(t => t.status === 'todo').length,
      prog:  allTasks.filter(t => t.status === 'progress').length,
      done:  allTasks.filter(t => t.status === 'done').length,
    };

    document.getElementById('pageContent').innerHTML = `
      ${_renderHeader()}
      ${_renderStats(counts)}
      ${_renderFilters()}
      <div class="task-grid">${_renderCards(filtered)}</div>
    `;
  }

  function _renderHeader() {
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Task Dashboard</div>
          <div class="page-sub">Manage and assign tasks to your team</div>
        </div>
        <button class="btn btn-primary" onclick="Tasks.openCreateModal()">＋ New Task</button>
      </div>`;
  }

  function _renderStats({ total, todo, prog, done }) {
    return `
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-num">${total}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color:var(--ink2)">${todo}</div>
          <div class="stat-label"><span class="stat-dot" style="background:var(--ink2)"></span>To Do</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color:var(--blue)">${prog}</div>
          <div class="stat-label"><span class="stat-dot" style="background:var(--blue)"></span>In Progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color:var(--green)">${done}</div>
          <div class="stat-label"><span class="stat-dot" style="background:var(--green)"></span>Completed</div>
        </div>
      </div>`;
  }

  function _renderFilters() {
    const tabs = [
      { key: 'all',      label: 'All' },
      { key: 'todo',     label: 'To Do' },
      { key: 'progress', label: 'In Progress' },
      { key: 'done',     label: 'Done' },
      { key: 'high',     label: '🔴 High' },
      { key: 'medium',   label: '🟡 Medium' },
      { key: 'low',      label: '🟢 Low' },
    ];
    return `
      <div class="filters">
        ${tabs.map(t => `
          <button class="filter-btn ${_filter === t.key ? 'active' : ''}"
                  onclick="AdminView.setFilter('${t.key}')">${t.label}</button>
        `).join('')}
        <input class="filter-search" placeholder="🔍  Search tasks…"
               value="${_search}"
               oninput="AdminView.setSearch(this.value)"/>
      </div>`;
  }

  function _renderCards(tasks) {
    if (tasks.length === 0) return `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-title">No tasks found</div>
        <div class="empty-sub">Try a different filter or create a new task</div>
      </div>`;

    return tasks.map(task => _renderCard(task)).join('');
  }

  function _renderCard(t) {
    const emp      = EMPLOYEES.find(e => e.id === t.assignee);
    const initials = emp ? emp.name.split(' ').map(n => n[0]).join('') : '?';
    const overdue  = t.due && new Date(t.due) < new Date() && t.status !== 'done';
    const statusLabel = { todo: 'To Do', progress: 'In Progress', done: 'Done' }[t.status] || t.status;

    return `
      <div class="task-card priority-${t.priority}">
        <div class="task-top">
          <div class="task-badges">
            <span class="badge badge-${t.priority}">${t.priority}</span>
            <span class="badge badge-${t.status}">${statusLabel}</span>
          </div>
          <button class="task-edit-btn" onclick="Tasks.openEditModal('${t.id}')" title="Edit task">✏️</button>
        </div>

        <div class="task-title">${t.title}</div>
        <div class="task-desc">${t.desc || 'No description.'}</div>

        <div class="task-meta">
          <div class="task-assignee">
            <div class="assignee-avatar" style="background:${emp ? emp.color : '#aaa'}">${initials}</div>
            ${emp ? emp.name : 'Unassigned'}
          </div>
          <div class="task-due ${overdue ? 'overdue' : ''}">
            ${t.due ? (overdue ? '⚠️ ' : '') + UI.formatDate(t.due) : ''}
          </div>
        </div>

        <div class="task-actions">
          <button class="btn btn-ghost btn-sm" onclick="Tasks.changeStatus('${t.id}','todo')">To Do</button>
          <button class="btn btn-ghost btn-sm" onclick="Tasks.changeStatus('${t.id}','progress')">In Progress</button>
          <button class="btn btn-ghost btn-sm" onclick="Tasks.changeStatus('${t.id}','done')">Done</button>
          <button class="btn btn-danger btn-sm" style="margin-left:auto"
                  onclick="Tasks.remove('${t.id}')">🗑</button>
        </div>
      </div>`;
  }

  return { render, setFilter, setSearch };
})();
