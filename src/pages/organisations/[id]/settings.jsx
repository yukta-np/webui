import CustomHead from '@/components/customHead/CustomHead';
import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import React from 'react';

const settings = () => {
  return (
    <>
      <CustomHead actualTitle="Organisation Settings" />
      <OrganisationLayout>Settings</OrganisationLayout>;
    </>
  );
};

export default settings;
