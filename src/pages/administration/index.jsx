// pages/settings/[id]/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import Settings from '@/components/settings/Settings';

export default function Page() {
  const router = useRouter();
  const { administration } = router.query; // Get student from router

 
  const currentType = administration || '';

  return (
    <>
      <CustomHead
        actualTitle={`Administration - ${
          administration ? `${administration} Profile` : 'All Administration'
        }`}
      />
      <Settings currentType="administration" />
    </>
  );
}
