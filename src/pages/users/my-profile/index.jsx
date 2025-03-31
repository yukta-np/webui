import React from 'react';
import CustomHead from '@/components/customHead/CustomHead';
import Profile from '@/components/my-profile/Profile';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Profile" />
      <Profile />
    </>
  );
};

export default index;
