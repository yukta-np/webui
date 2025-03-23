import LeaveRequest from '@/components/leave-request/LeaveRequest';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="My Leave Requests" />
      <LeaveRequest isMyLeave={true} />
    </>
  );
};

export default index;
