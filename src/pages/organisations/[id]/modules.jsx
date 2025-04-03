import ModuleList from '@/components/modules/ModuleList';
import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import React from 'react';
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';

const modules = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <CustomHead actualTitle="Organisation Modules" />
      <OrganisationLayout>
        <ModuleList params={{ id }} />
      </OrganisationLayout>
    </>
  );
};

export default modules;
