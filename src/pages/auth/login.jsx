import CustomHead from '@/components/customHead/CustomHead';
import LoginPage from '@/components/login/LoginPage';
import React from 'react';

const login = () => {
  return (
    <>
      <CustomHead actualTitle="Login" />
      <LoginPage />
    </>
  );
};

export default login;
