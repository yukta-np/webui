// // import CustomHead from '@/components/customHead/CustomHead';
// import Settings from '@/components/settings/Settings';
// import React from 'react';

// const index = () => {
//   return (
//     <>
//       {/* <CustomHead actualTitle="Your Settings" /> */}
//       <Settings />
//     </>
//   );
// };

// export default index;

// pages/settings/[id]/page.jsx
import Settings from '@/components/settings/Settings';

export default function Page() {
  return <Settings currentType={null} />;
}
