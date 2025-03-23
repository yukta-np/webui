import CustomHead from '@/components/customHead/CustomHead';
import LeaveRequest from '@/components/leave-request/LeaveRequest';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Team Leave Requests" />
      <LeaveRequest isMyTeamLeave={true} />
    </>
  );
};

export default index;
