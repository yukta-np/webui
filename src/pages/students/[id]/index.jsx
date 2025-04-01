import ControlCenter from '@/components/organisations/ControlCenter';
import OrganisationDetails from '@/components/organisations/OrganisationDetails';
import React from 'react';
import { useRouter } from 'next/router';
import StudentProfile from '@/components/students/StudentProfile';

const index = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <ControlCenter>
      <StudentProfile params={{ id }} />
    </ControlCenter>
  );
};

export default index;