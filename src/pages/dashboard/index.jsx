import CustomHead from '@/components/customHead/CustomHead';
import Dashboard from '@/components/dashboard/Dashboard';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Dashboard" />
      <Dashboard />
    </>
  );
};

export default index;
