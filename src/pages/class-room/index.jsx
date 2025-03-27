import ClassroomManagement from '@/components/class-room/ClassroomManagement';
import CustomHead from '@/components/customHead/CustomHead';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Classroom Management" />
      <ClassroomManagement />
    </>
  );
};

export default index;
