import { useRouter } from 'next/router';
import AdministrationEditForm from '@/components/administration/AdministrationEditForm';
import React from 'react';

const EditAdministration = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return <AdministrationEditForm params={{ id }} />;
};

export default EditAdministration;

