import React from 'react';
import CustomHead from '@/components/customHead/CustomHead';
import OrganisationList from '@/components/organisations/OrganisationList';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Organisations" />
      <OrganisationList />
    </>
  );
};

export default index;
