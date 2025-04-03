import React from 'react';

import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import OrganisationPlan from '@/components/plans/OrganisationPlan';
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';

const plans = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <CustomHead actualTitle="Organisation Plan" />
      <OrganisationLayout>
        <OrganisationPlan params={{ id }} />
      </OrganisationLayout>
    </>
  );
};

export default plans;
