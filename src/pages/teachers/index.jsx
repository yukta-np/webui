// pages/settings/[id]/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import Settings from '@/components/settings/Settings';

export default function Page() {
  const router = useRouter();
  const { teachers } = router.query; // Get student from router

 
  const currentType = teachers || '';

  return (
    <>
      <CustomHead
        actualTitle={`Teachers - ${
          teachers ? `${teachers} Profile` : 'All Teachers'
        }`}
      />
      <Settings currentType="teachers" />
    </>
  );
}
