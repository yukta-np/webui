// app/students/[id]/edit/page.jsx
'use client';

import { Modal, Typography, Breadcrumb, Button } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentForm from '@/components/students/StudentForm';
// import { initialStudentData } from '@/data/students';
import { Card } from 'antd';

// const { confirm } = Modal;

const { Title } = Typography;

const EditStudentPage = ({ params }) => {
  const router = useRouter();
  const student = initialStudentData.find((s) => s.key === params.id);

  const onSubmit = (values) => {
    // Update logic
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
        <Breadcrumb.Item>Edit {student?.firstName}</Breadcrumb.Item>
      </Breadcrumb>

      <Card title={`Edit Student - ${student.firstName}`}>
        <StudentForm initialValues={student} onFinish={onSubmit} />
        <div className="mt-4">
          <Button type="primary" htmlType="submit" form="student-form">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditStudentPage;
