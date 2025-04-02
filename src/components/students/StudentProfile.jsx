'use client';
// StudentProfile.js
import {
  Card,
  Typography,
  Breadcrumb,
  Button,
  Row,
  Col,
  Tag,
  Avatar,
  Divider,
  Descriptions,
  Skeleton,
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Wallet,
  Contact,
  School,
  Fingerprint,
  CalendarDays,
  ShieldAlert,
} from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';

const { Title, Text } = Typography;

const StudentProfile = ({ params }) => {
  const router = useRouter();
   const id = params?.id;
  const { students, isLoading, isError } = useStudents();
  const student = students?.find((s) => String(s.id) === String(id));

  if (!params?.id) return <div>Loading student ID...</div>;

  if (isLoading)
    return (
      <div className="p-4 max-w-8xl mx-auto">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );

  if (isError)
    return (
      <div className="p-4 gap-4">
        <Card className="text-center">
          <Title level={3} className="mb-4 text-red-600">
            Loading Error
          </Title>
          <Text className="mb-4 block text-gray-600">
            Failed to load student data. Please try again later.
          </Text>
          <Button type="primary" onClick={() => router.push('/students')}>
            Return to Student List
          </Button>
        </Card>
      </div>
    );

  if (!students)
    return (
      <div className="p-4 gap-4">
        <Card className="text-center">
          <Title level={3} className="mb-4 text-gray-800">
            Student Not Found
          </Title>
          <Text className="mb-4 block text-gray-600">
            The requested student record does not exist in our system.
          </Text>
          <Button type="primary" onClick={() => router.push('/students')}>
            Return to Student Directory
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="p-6 gap-4">
      {/* <Breadcrumb className="mb-6 text-sm">
        <Breadcrumb.Item>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/students" className="text-gray-500 hover:text-gray-700">
            Students
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="text-gray-700 font-medium">
          {students.firstName} {students.lastName}
        </Breadcrumb.Item>
      </Breadcrumb> */}

      <Card className="shadow-sm border-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-6">
            <Avatar
              src={student.avatar}
              size={100}
              className="border-2 border-gray-200"
            />
            <div>
              <Title level={2} className="mb-1 text-gray-800">
                {student?.firstName} {student?.middleName}{' '}
                {student?.lastName}
              </Title>
              <Text
                type="secondary"
                className="text-gray-500 text-lg flex items-center gap-2"
              >
                <School size={18} />
                {student.faculty} • {student.program}
              </Text>
            </div>
          </div>
          <Button
            type="default"
            onClick={() => router.push(`/students/${params.id}/edit`)}
            className="flex items-center gap-2 border-gray-300 text-gray-600 hover:border-gray-400"
          >
            Edit Profile
          </Button>
        </div>

        <Divider className="my-6" />

        <Row gutter={[24, 24]} className="mb-8">
          {/* Personal Details Card */}
          <Col xs={24} md={8}>
            <Card className="border-0 shadow-none">
              <Title level={4} className="mb-4 text-gray-800 flex items-center">
                <User size={20} className="mr-2" /> Personal Details
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item label="Student ID">
                  {student.id}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {student.dateOfBirth}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    color={student.isActive ? 'green' : 'red'}
                    className="rounded-full"
                  >
                    {student.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Financial Information Card */}
          <Col xs={24} md={8}>
            <Card className="border-0 shadow-none">
              <Title level={4} className="mb-4 text-gray-800 flex items-center">
                <Wallet size={20} className="mr-2" /> Financial Information
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item label="Tuition Balance">
                  <Text
                    className={`text-lg ${
                      student.dueAmount > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    ${student.dueAmount}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Scholarship">
                  <Tag
                    color={student.scholarshipStatus ? 'green' : 'volcano'}
                    className="rounded-full"
                  >
                    {student.scholarshipStatus ? 'Awarded' : 'Not Applicable'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Last Payment">
                  {student.astPaymentDate}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Contact Information Card */}
          <Col xs={24} md={8}>
            <Card className="border-0 shadow-none">
              <Title level={4} className="mb-4 text-gray-800 flex items-center">
                <Contact size={20} className="mr-2" /> Contact Information
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item label="Email">
                  {student.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {student.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {student.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Divider className="my-6" />

        {/* Academic Profile Section */}
        <Card className="border-0 shadow-none">
          <Title level={4} className="mb-4 text-gray-800 flex items-center">
            <Fingerprint size={20} className="mr-2" /> Academic Profile
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Descriptions column={1}>
                <Descriptions.Item label="Faculty">
                  {student.faculty}
                </Descriptions.Item>
                <Descriptions.Item label="Program">
                  {student.program}
                </Descriptions.Item>
                <Descriptions.Item label="Enrollment Date">
                  {student.enrollmentDate}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <Descriptions column={1}>
                <Descriptions.Item label="Batch Number">
                  {student.batchNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Faculty ID">
                  {student.facultyId}
                </Descriptions.Item>
                <Descriptions.Item label="Academic Standing">
                  <Tag color="blue" className="rounded-full">
                    {student.academicStanding}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  );
};

export default StudentProfile;
