import { useRouter } from 'next/router';
import StudentProfile from '@/components/students/StudentProfile';
import React from 'react';

const ViewStudent = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return <StudentProfile params={{ id }} />;
};

export default ViewStudent;
