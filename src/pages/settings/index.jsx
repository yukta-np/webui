// pages/settings/[id]/page.jsx
import React from 'react';
import CustomHead from '@/components/customHead/CustomHead';
import Settings from '@/components/settings/Settings';

export default function Page() {
  return (
    <>
      <CustomHead actualTitle="Settings" />
      <Settings currentType={null} />
    </>
  );
}
