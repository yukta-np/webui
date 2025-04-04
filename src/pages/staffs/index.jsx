// pages/settings/[id]/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';

export default function Page() {
  const router = useRouter();
  const { staffs } = router.query; // Get student from router

  const currentType = staffs || '';

  return (
    <>
      <CustomHead
        actualTitle={`Staff - ${staffs ? `${staffs} Profile` : 'All Staffs'}`}
      />
      <Settings currentType="staffs" />
    </>
  );
}
