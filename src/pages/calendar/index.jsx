import AcademicCalendarEditor from '@/components/calendar/AcademicCalendarEditor';
import NepaliDate from 'nepali-date-converter';
import Head from 'next/head';
import React from 'react';

const index = () => {
  const today = new NepaliDate();

  return (
    <>
      <Head>
        <title>Yukta | {today.format('DD-MM-YYYY')}</title>
      </Head>
      <AcademicCalendarEditor />
    </>
  );
};

export default index;
