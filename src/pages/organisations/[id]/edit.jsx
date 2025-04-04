import { useAppContext } from '@/app-context';
import CustomHead from '@/components/customHead/CustomHead';
import OrganisationForm from '@/components/organisations/OrganisationForm';
import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import React from 'react';

const edit = () => {
  const { loggedInUser } = useAppContext();
  const orgId = loggedInUser?.orgId;

  return (
    <>
      <CustomHead actualTitle="Edit Organisation" />
      <OrganisationLayout>
        <OrganisationForm orgId={orgId} />
      </OrganisationLayout>
    </>
  );
};

export default edit;
