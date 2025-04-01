import ModuleList from '@/components/modules/ModuleList';
import ControlCenter from '@/components/organisations/ControlCenter';
import React from 'react';
import { useRouter } from 'next/router';

const modules = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <ControlCenter>
      <ModuleList params={{ id }} />
    </ControlCenter>
  );
};

export default modules;
