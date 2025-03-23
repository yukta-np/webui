import CustomHead from '@/components/customHead/CustomHead';
import PermissionGroupForm from '@/components/permission-groups/PermissionGroupForm';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Create a new Permission Group" />
      <PermissionGroupForm mode="new" />
    </>
  );
};

export default index;
