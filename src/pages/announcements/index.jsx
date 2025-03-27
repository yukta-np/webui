import Announcements from '@/components/announcements/Announcements';
import React from 'react';
import CustomHead from '@/components/customHead/CustomHead';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Announcements" />
      <Announcements />
    </>
  );
};

export default index;
