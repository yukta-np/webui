// pages/settings/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import Settings from '@/components/settings/Settings';

export default function Page() {
  const router = useRouter();
  const { id } = router.query; // Get id from router

  return (
    <>
      <CustomHead
        actualTitle={`Settings - ${
          id ? `${id} Settings` : 'Management Settings'
        }`}
      />
      <Settings/>
    </>
  );
}

