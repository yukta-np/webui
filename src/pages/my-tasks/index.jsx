import Dashboard from '@/components/dashboard/Dashboard';
import MyTasks from '@/components/tasks/MyTasks';
import React from 'react';

const index = () => {
  return (
    <Dashboard>
      <MyTasks />
    </Dashboard>
  );
};

export default index;
