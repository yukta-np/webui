import CustomHead from '@/components/customHead/CustomHead';
import Plans from '@/components/plans/Plans';
import React from 'react';

const plans = () => {
  return (
    <div>
      <CustomHead actualTitle="Plans" />
      <Plans />
    </div>
  );
};

export default plans;
