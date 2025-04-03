import ControlCenter from '@/components/students/ControlCenter';
import StudentProfile from '@/components/students/StudentProfile';
import React from 'react';
import { useRouter } from 'next/router';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useStudents } from '@/hooks/useStudents';

const Index = () => {
  const router = useRouter();
  const id = router.query.id;
  const { students, isLoading, isError } = useStudents();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading student data</div>;

  const student = students?.find((s) => String(s.id) === String(id));

  return (
    <>
      <Breadcrumb style={{ margin: '16px' }}>
        <Breadcrumb.Item>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            href="/data-sources"
            className="text-gray-500 hover:text-gray-700"
          >
            Data Sources
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/students" className="text-gray-500 hover:text-gray-700">
            Students
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {student
            ? `${student.fullName}`
            : 'Student Profile'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <ControlCenter>
        <StudentProfile params={{ id }} />
      </ControlCenter>
    </>
  );
};

export default Index;

