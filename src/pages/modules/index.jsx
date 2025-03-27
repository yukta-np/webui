import CustomHead from '@/components/customHead/CustomHead';
import ModulesList from '@/components/modules/ModulesList';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Modules" />
      <ModulesList />;
    </>
  );
};

export default index;
