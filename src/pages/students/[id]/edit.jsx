import { useRouter } from 'next/router';
import StudentEditForm from '@/components/students/StudentEditForm';
import React from 'react';

const EditStudent = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return <StudentEditForm params={{ id }} />;
};

export default EditStudent;
