import Dashboard from '@/components/dashboard/Dashboard';
import Head from 'next/head';
import React from 'react';

const index = () => {
  return (
    <>
      <Head>
        <title>Yukta | Home</title>
      </Head>
      <Dashboard />
    </>
  );
};

export default index;
