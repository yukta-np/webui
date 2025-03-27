import CustomHead from '@/components/customHead/CustomHead';
import Documents from '@/components/documents/Documents';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Documents" />
      <Documents />
    </>
  );
};

export default index;
