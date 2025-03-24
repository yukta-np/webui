import PerrmissionGroupList from '@/components/permission-groups/PerrmissionGroupList';
import React from 'react';
import CustomHead from '@/components/customHead/CustomHead';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Permissions Group List" />
      <PerrmissionGroupList />
    </>
  );
};

export default index;
