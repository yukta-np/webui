import PermissionGroupForm from '@/components/permission-groups/PermissionGroupForm';
import CustomHead from '@/components/customHead/CustomHead';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Edit Permissions Group" />
      <PermissionGroupForm mode="edit" />
    </>
  );
};

export default index;
