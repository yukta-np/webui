import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import OrganisationDetails from '@/components/organisations/OrganisationDetails';
import React from 'react';
import { useRouter } from 'next/router';
import StudentProfile from '@/components/students/StudentProfile';

const index = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <OrganisationLayout>
      <StudentProfile params={{ id }} />
    </OrganisationLayout>
  );
};

export default index;
