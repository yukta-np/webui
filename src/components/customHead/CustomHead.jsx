import Head from 'next/head';

const CustomHead = ({ actualTitle, children = null }) => {
  return (
    <Head>
      <title>Yukta | {actualTitle}</title>
      {children}
    </Head>
  );
};

export default CustomHead;
