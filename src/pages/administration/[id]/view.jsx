import { useRouter } from 'next/router';
import AdministrationProfile from '@/components/administration/administrationProfile';
import React from 'react';

const ViewAdministration = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return <AdministrationProfile params={{ id }} />;
};

export default ViewAdministration;

