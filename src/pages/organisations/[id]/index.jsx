import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import OrganisationDetails from '@/components/organisations/OrganisationDetails';
import React from 'react';
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';

const index = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <CustomHead title="Organisation" />
      <OrganisationLayout>
        <OrganisationDetails params={{ id }} />
      </OrganisationLayout>
    </>
  );
};

export default index;
