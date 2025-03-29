// app/students/[id]/page.jsx
'use client';

import { Card, Typography, Breadcrumb, Button, Row, Col, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentForm from '@/components/students/StudentForm';
import { FilePenLine } from 'lucide-react';

const { Title, Text } = Typography;

// Mock Data (should be moved to a shared file in real app)
const initialStudentData = [
  {
    key: '1',
    firstName: 'John',
    middleName: 'Doe',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phoneNumber: '+1234567890',
    dateOfBirth: '2000-01-01',
    nationality: 'American',
    address: '123 Main Street, City, Country',
    facultyId: 1,
    faculty: 'BBA',
    program: 'Computer Science',
    batchNumber: '2025A',
    enrollmentDate: '2023-08-15',
    graduationDate: '2027-06-01',
    dueAmount: 5000,
    scholarshipStatus: true,
    isCr: false,
    isActive: true,
    avatar: 'https://example.com/avatar.jpg',
    userId: 101,
    guardianUserId: 201,
    guardianName: 'Jane Smith',
    guardianContact: '+1987654321',
    emergencyContact: '+1122334455',
  },
];

const StudentProfile = ({ params }) => {
  const router = useRouter();
  const student = initialStudentData.find((s) => s.key === params.id);

  if (!student) {
    return (
      <div className="p-6">
        <Title level={3}>Student not found</Title>
        <Button type="primary" onClick={() => router.push('/students')}>
          Return to Student List
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/students">Students</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {student.firstName} {student.lastName}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="mb-0">
              Student Profile
            </Title>
            <Button
              type="primary"
              icon={<FilePenLine size={16} />}
              onClick={() => router.push(`/students/${params.id}/edit`)}
            >
              Edit Profile
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        <div className="mb-8">
          <StudentForm initialValues={student} mode="view" />
        </div>

        {/* Additional Information Section */}
        <Title level={5} className="mb-4">
          Status Information
        </Title>
        <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Text strong>Account Status:</Text>
            <Tag color={student.isActive ? 'green' : 'red'} className="ml-2">
              {student.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </Col>
          <Col span={8}>
            <Text strong>Scholarship Status:</Text>
            <Tag
              color={student.scholarshipStatus ? 'green' : 'red'}
              className="ml-2"
            >
              {student.scholarshipStatus ? 'Awarded' : 'Not Awarded'}
            </Tag>
          </Col>
          <Col span={8}>
            <Text strong>Class Representative:</Text>
            <Tag color={student.isCr ? 'blue' : 'default'} className="ml-2">
              {student.isCr ? 'Yes' : 'No'}
            </Tag>
          </Col>
        </Row>

        {/* System Information */}
        <Title level={5} className="mb-4">
          System Information
        </Title>
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Student ID:</Text>
            <Text className="ml-2">{student.key}</Text>
          </Col>
          <Col span={8}>
            <Text strong>User ID:</Text>
            <Text className="ml-2">{student.userId}</Text>
          </Col>
          <Col span={8}>
            <Text strong>Faculty ID:</Text>
            <Text className="ml-2">{student.facultyId}</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StudentProfile;
