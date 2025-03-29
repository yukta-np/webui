import ModuleList from '@/components/modules/ModuleList';
import ControlCenter from '@/components/organisations/ControlCenter';
import React from 'react';

const modules = () => {
  return (
    <ControlCenter>
      <ModuleList />
    </ControlCenter>
  );
};

export default modules;
