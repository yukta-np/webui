// pages/settings/[id]/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import StudentListPage from '@/components/students/StudentList';

export default function Page() {
  const router = useRouter();
  const { students } = router.query; // Get student from router

  // on undefined student safely
  const currentType = students || '';

  return (
    <>
      <CustomHead
        actualTitle={`Students - ${
          students ? `${students} Profile` : 'All Students'
        }`}
      />
      <StudentListPage />
    </>
  );
}
