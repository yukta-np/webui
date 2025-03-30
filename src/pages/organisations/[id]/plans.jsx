import React from 'react';

import ControlCenter from '@/components/organisations/ControlCenter';
import OrganisationPlan from '@/components/plans/OrganisationPlan';

const plans = () => {
  return (
    <>
      <ControlCenter>
        <OrganisationPlan />
      </ControlCenter>
    </>
  );
};

export default plans;
