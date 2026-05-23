/* ══════════════════════════════════════
   data.js — Static App Data (Users, Employees)
   ══════════════════════════════════════ */

const EMPLOYEES = [
  { id: 'alice', name: 'Alice Johnson', color: '#e8440a' },
  { id: 'bob',   name: 'Bob Smith',     color: '#1a4f8a' },
  { id: 'carol', name: 'Carol White',   color: '#1a7a4a' },
];

const USERS = {
  admin: { pass: 'admin123', role: 'admin',    name: 'Admin' },
  alice: { pass: 'pass123',  role: 'employee', name: 'Alice Johnson' },
  bob:   { pass: 'pass123',  role: 'employee', name: 'Bob Smith' },
  carol: { pass: 'pass123',  role: 'employee', name: 'Carol White' },
};

const DEFAULT_TASKS = [
  {
    title: 'Design new landing page',
    desc: 'Create wireframes and mockups for the Q3 product launch landing page.',
    assignee: 'alice', priority: 'high', status: 'todo', due: '2026-05-30',
  },
  {
    title: 'Fix payment gateway bug',
    desc: 'Users are unable to complete checkout with Visa cards. Investigate and resolve.',
    assignee: 'bob', priority: 'high', status: 'progress', due: '2026-05-25',
  },
  {
    title: 'Write onboarding docs',
    desc: 'Document the new employee onboarding process including tool access and workflows.',
    assignee: 'carol', priority: 'medium', status: 'todo', due: '2026-06-05',
  },
  {
    title: 'Update npm packages',
    desc: 'Audit and update all outdated dependencies in the main repo.',
    assignee: 'bob', priority: 'low', status: 'done', due: '2026-05-20',
  },
  {
    title: 'Conduct user interviews',
    desc: 'Schedule and conduct 5 user interviews for the new dashboard feature.',
    assignee: 'alice', priority: 'medium', status: 'progress', due: '2026-05-28',
  },
];
