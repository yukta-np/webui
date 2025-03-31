import ControlCenter from '@/components/organisations/ControlCenter';
import OrganisationUsers from '@/components/organisations/OrganisationUsers';
import React from 'react';
import { useRouter } from 'next/router';

const users = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <ControlCenter>
      <OrganisationUsers params={{ id }} />
    </ControlCenter>
  );
};

export default users;
