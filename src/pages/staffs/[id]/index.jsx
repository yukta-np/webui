import StaffLayout from '@/components/staffs/StaffLayout';
import StaffProfile from '@/components/staffs/StaffProfile';

import React from 'react';
import { useRouter } from 'next/router';

const index = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <StaffLayout>
      <StaffProfile params={{ id }} />
    </StaffLayout>
  );
};

export default index;

