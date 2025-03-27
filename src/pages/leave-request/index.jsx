import CustomHead from '@/components/customHead/CustomHead';
import LeaveRequest from '@/components/leave-request/LeaveRequest';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Leave Requests" />
      <LeaveRequest isAllLeave={true} />
    </>
  );
};

export default index;
