
import StudentLayout from '@/components/students/StudentLayout';
import StudentProfile from '@/components/students/StudentProfile';

import React from 'react';
import { useRouter } from 'next/router';

const index = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <StudentLayout>
      <StudentProfile params={{ id }} />
    </StudentLayout>
  );
};

export default index;
