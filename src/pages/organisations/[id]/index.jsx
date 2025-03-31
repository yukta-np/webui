import ControlCenter from '@/components/organisations/ControlCenter';
import OrganisationDetails from '@/components/organisations/OrganisationDetails';
import React from 'react';
import { useRouter } from 'next/router';

const index = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <ControlCenter>
      <OrganisationDetails params={{ id }} />
    </ControlCenter>
  );
};

export default index;
