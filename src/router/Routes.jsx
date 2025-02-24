import Dashboard from "@/components/dashboard/Dashboard";

export const ROUTES = [
  { path: '/', component: <Dashboard /> },
  { path: '/dashboard', component: <Dashboard /> },
  { path: '/my-tasks', component: 'MyTasks' },
  { path: '/routine', component: 'Routine' },
  { path: '/leave-request', component: 'LeaveRequest' },
];
