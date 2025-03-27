import AcademicCalendarEditor from '@/components/calendar/AcademicCalendarEditor';
import CustomHead from '@/components/customHead/CustomHead';
import NepaliDate from 'nepali-date-converter';
import Head from 'next/head';
import React from 'react';

const index = () => {
  const today = new NepaliDate();

  return (
    <>
      <CustomHead actualTitle={today.format('DD-MM-YYYY')} />
      <AcademicCalendarEditor />
    </>
  );
};

export default index;
