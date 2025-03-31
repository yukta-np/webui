// pages/administration/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import AdministrationList from '@/components/administration/administrationList';

export default function Page() {
  const router = useRouter();
  const { administration } = router.query; // Get administration from router

  // on undefined administration safely
  const currentType = administration || '';

  return (
    <>
      <CustomHead
        actualTitle={`Administration - ${
          administration ? `${administration} Profile` : 'All Administration'
        }`}
      />
      <AdministrationList />
    </>
  );
}

