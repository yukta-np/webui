import React from 'react';

import ControlCenter from '@/components/organisations/ControlCenter';
import OrganisationPlan from '@/components/plans/OrganisationPlan';
import { useRouter } from 'next/router';

const plans = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <ControlCenter>
        <OrganisationPlan params={{ id }} />
      </ControlCenter>
    </>
  );
};

export default plans;
