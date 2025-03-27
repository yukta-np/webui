import LeaveRequest from '@/components/leave-request/LeaveRequest';
import React from 'react';
import CustomHead from '@/components/customHead/CustomHead';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="My Leave Requests" />
      <LeaveRequest isMyLeave={true} />
    </>
  );
};

export default index;
