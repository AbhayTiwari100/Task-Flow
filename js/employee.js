/* ══════════════════════════════════════
   employee.js — Employee Kanban Board Renderer
   ══════════════════════════════════════ */

const EmployeeView = (() => {

  /* ── Render full employee page ── */
  function render() {
    const user  = Auth.currentUser();
    const tasks = Storage.getTasksForEmployee(user.id);

    const todo  = tasks.filter(t => t.status === 'todo');
    const prog  = tasks.filter(t => t.status === 'progress');
    const done  = tasks.filter(t => t.status === 'done');

    document.getElementById('pageContent').innerHTML = `
      ${_renderHeader(tasks.length)}
      ${_renderStats(tasks.length, todo.length, prog.length, done.length)}
      <div class="kanban">
        ${_renderColumn('📋 To Do',       'todo',     todo)}
        ${_renderColumn('⚡ In Progress', 'progress', prog)}
        ${_renderColumn('✅ Done',        'done',     done)}
      </div>
    `;
  }

  function _renderHeader(total) {
    return `
      <div class="page-header">
        <div>
          <div class="page-title">My Tasks</div>
          <div class="page-sub">Tasks assigned to you — ${total} total</div>
        </div>
      </div>`;
  }

  function _renderStats(total, todo, prog, done) {
    return `
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-num">${total}</div>
          <div class="stat-label">My Tasks</div>
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

  function _renderColumn(title, status, tasks) {
    return `
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="kanban-col-title">${title}</div>
          <div class="kanban-count">${tasks.length}</div>
        </div>
        <div class="kanban-cards">
          ${tasks.length === 0
            ? '<div class="kanban-empty">No tasks here</div>'
            : tasks.map(t => _renderCard(t)).join('')}
        </div>
      </div>`;
  }

  function _renderCard(t) {
    const overdue    = t.due && new Date(t.due) < new Date() && t.status !== 'done';
    const nextStatus = t.status === 'todo' ? 'progress' : t.status === 'progress' ? 'done' : null;
    const nextLabel  = t.status === 'todo' ? '▶ Start' : 'Mark Done';

    return `
      <div class="kanban-task">
        <div class="kanban-task-header">
          <div class="kanban-task-title">${t.title}</div>
          <span class="badge badge-${t.priority}" style="flex-shrink:0">${t.priority}</span>
        </div>
        <div class="kanban-task-desc">${t.desc || ''}</div>
        <div class="kanban-task-footer">
          <div class="kanban-task-due ${overdue ? 'overdue' : ''}">
            ${t.due ? (overdue ? '⚠️ ' : '') + UI.formatDate(t.due) : ''}
          </div>
          ${nextStatus
            ? `<button class="btn btn-primary btn-sm"
                       onclick="Tasks.changeStatus('${t.id}','${nextStatus}')">${nextLabel}</button>`
            : `<span class="done-label">✓ Complete</span>`}
        </div>
      </div>`;
  }

  return { render };
})();
