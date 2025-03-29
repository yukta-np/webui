// app/students/new/page.jsx
'use client';

import { Card, Typography, Breadcrumb, Button } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentForm from '@/components/students/StudentForm';

const { Title } = Typography;

const NewStudentPage = () => {
  const router = useRouter();

  const handleSubmit = (values) => {
    // Create logic
    router.push('/students');
  };

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/students">Students</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>New Student</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Create New Student">
        <StudentForm onFinish={handleSubmit} />
        <div className="mt-4">
          <Button type="primary" htmlType="submit" form="student-form">
            Create Student
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NewStudentPage;

