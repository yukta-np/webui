import CustomHead from '@/components/customHead/CustomHead';
import FeedbackModule from '@/components/feedback/FeedbackModule';
import React from 'react';

const index = () => {
  return (
    <>
      <CustomHead actualTitle="Feedback" />
      <FeedbackModule />
    </>
  );
};

export default index;
