// pages/settings/[id]/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import StudentListPage from '@/components/students/StudentList';
import { Breadcrumb } from 'antd';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  const { students } = router.query; // Get student from router

  // on undefined student safely
  const currentType = students || '';

  return (
    <>
      <CustomHead
        actualTitle="Students"
      />
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/data-sources" className="text-gray-500 hover:text-gray-700">
            Data Sources
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
            Students
        </Breadcrumb.Item>
      </Breadcrumb>
      <StudentListPage />
    </>
  );
}
