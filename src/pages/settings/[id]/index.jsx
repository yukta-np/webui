// pages/settings/[id]/index.jsx
'use client';

import { useRouter } from 'next/router';
import Settings from '@/components/settings/Settings'; // Adjust the import path

const SettingsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // If you need to modify the URL structure, you can transform the ID here
  const transformedId = id?.replace('-staff', '');

  return <Settings currentType={transformedId} />;
};

export default SettingsPage;
