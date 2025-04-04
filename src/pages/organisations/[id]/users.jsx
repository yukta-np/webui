import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import OrganisationUsers from '@/components/organisations/OrganisationUsers';
import React from 'react';
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';

const users = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <CustomHead actualTitle="Organisation Users" />
      <OrganisationLayout>
        <OrganisationUsers params={{ id }} />
      </OrganisationLayout>
    </>
  );
};

export default users;
