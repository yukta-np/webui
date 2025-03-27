// pages/settings/[id]/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import Settings from '@/components/settings/Settings';

export default function Page() {
  const router = useRouter();
  const { id } = router.query; // Get id from router

  // Handle undefined id safely
  const currentType = id ? id.replace('-staff', '') : '';

  return (
    <>
      <CustomHead
        actualTitle={`Settings - ${
          currentType ? `${currentType} Settings` : 'Management Settings'
        }`}
      />
      <Settings currentType={currentType} />
    </>
  );
}
