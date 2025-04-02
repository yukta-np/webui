import ControlCenter from '@/components/students/ControlCenter';
import StudentProfile from '@/components/students/StudentProfile';
import React from 'react';
import { useRouter } from 'next/router';

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
