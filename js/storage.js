/* ══════════════════════════════════════
   storage.js — localStorage Wrapper & Task CRUD
   ══════════════════════════════════════ */

const Storage = (() => {
  const KEY = 'tf_tasks';

  /** Generate a unique ID */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /** Get all tasks from localStorage */
  function getTasks() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  /** Save all tasks to localStorage */
  function saveTasks(tasks) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }

  /** Seed default tasks if localStorage is empty */
  function initDefaults() {
    if (getTasks().length === 0) {
      const seeded = DEFAULT_TASKS.map((t, i) => ({
        id: uid(),
        created: Date.now() - i * 1000,
        ...t,
      }));
      saveTasks(seeded);
    }
  }

  /** Create a new task */
  function createTask({ title, desc, priority, due, assignee }) {
    const tasks = getTasks();
    const task = { id: uid(), title, desc, priority, due, assignee, status: 'todo', created: Date.now() };
    tasks.push(task);
    saveTasks(tasks);
    return task;
  }

  /** Update an existing task by id */
  function updateTask(id, updates) {
    const tasks = getTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates };
    saveTasks(tasks);
    return tasks[idx];
  }

  /** Delete a task by id */
  function deleteTask(id) {
    const tasks = getTasks().filter(t => t.id !== id);
    saveTasks(tasks);
  }

  /** Get tasks for a specific employee */
  function getTasksForEmployee(employeeId) {
    return getTasks().filter(t => t.assignee === employeeId);
  }

  return { getTasks, saveTasks, initDefaults, createTask, updateTask, deleteTask, getTasksForEmployee };
})();
