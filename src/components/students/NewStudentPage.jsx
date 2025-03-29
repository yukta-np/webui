import { useState } from 'react';
import { Card, Typography, Breadcrumb, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentForm from '@/components/students/StudentForm';
import { studentService } from '@/services/students.http';

const { Title } = Typography;

const NewStudentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call your API service
      const response = await studentService.createStudent(values);
      
      if (response.data) {
        message.success('Student created successfully');
        router.push('/students');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
      message.error('Failed to create student');
    } finally {
      setLoading(false);
    }
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
        <StudentForm 
          onFinish={onSubmit}
          mode="create"
          error={error}
          loading={loading}
        />
        <div className="mt-4">
          <Button 
            type="primary" 
            htmlType="submit" 
            form="student-form"
            loading={loading}
          >
            Create Student
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NewStudentPage;