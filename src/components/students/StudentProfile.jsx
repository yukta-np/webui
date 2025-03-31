'use client';
import {
  Card,
  Typography,
  Breadcrumb,
  Button,
  Row,
  Col,
  Tag,
  Image,
  Divider,
  Descriptions,
  Skeleton,
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FilePenLine,
  Mail,
  Phone,
  Home,
  User,
  GraduationCap,
  Cake,
  CalendarDays,
  ShieldAlert,
  Wallet,
  School,
  Contact,
} from 'lucide-react';
import { BankFilled } from '@ant-design/icons';
import { useStudents } from '@/hooks/useStudents';

const { Title, Text } = Typography;

const StudentProfile = ({ params }) => {
  const router = useRouter();
  const { students, isLoading, isError } = useStudents({}, params.id);

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

  if (!students) {
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
  }

  return (
    <div className="p-6 gap-4">
      <Breadcrumb className="mb-6 text-sm">
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
      </Breadcrumb>

      <Card
        className="shadow-sm border-0"
        cover={
          students.avatar && (
            <div className="h-48 bg-gray-50 overflow-hidden flex items-center justify-center border-b">
              <Image
                src={students.avatar}
                alt="Student avatar"
                preview={false}
                className="object-contain"
                width={200}
                height={200}
              />
            </div>
          )
        }
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Title level={2} className="mb-1 text-gray-800">
              {students.firstName} {students.middleName} {students.lastName}
            </Title>
            <Text
              type="secondary"
              className="text-gray-500 text-lg flex items-center gap-2"
            >
              <School size={18} />
              {students.faculty} • {students.program}
            </Text>
          </div>
          <Button
            type="default"
            icon={<FilePenLine size={16} />}
            onClick={() => router.push(`/students/${params.id}/edit`)}
            className="flex items-center gap-2 border-gray-300 text-gray-600 hover:border-gray-400"
          >
            Edit Profile
          </Button>
        </div>

        <Divider className="my-6" />

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={8}>
            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <div>
                  <Text strong className="text-gray-600">
                    Student ID
                  </Text>
                  <Text className="block text-gray-800">{students.id}</Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="text-gray-500" />
                <div>
                  <Text strong className="text-gray-600">
                    Batch
                  </Text>
                  <Text className="block text-gray-800">
                    {students.batchNumber}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BankFilled className="text-gray-500" />
                <div>
                  <Text strong className="text-gray-600">
                    Faculty ID
                  </Text>
                  <Text className="block text-gray-800">
                    {students.facultyId}
                  </Text>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card className="border-0 shadow-none">
                  <Title
                    level={4}
                    className="mb-4 text-gray-800 flex items-center gap-2"
                  >
                    <Contact size={18} /> Contact Information
                  </Title>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Email" className="text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500" />
                        <Text className="text-gray-800">{students.email}</Text>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <Text className="text-gray-800">
                          {students.phoneNumber}
                        </Text>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-gray-500" />
                        <Text className="text-gray-800">
                          {students.address}
                        </Text>
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col span={24}>
                <Card className="border-0 shadow-none">
                  <Title
                    level={4}
                    className="mb-4 text-gray-800 flex items-center gap-2"
                  >
                    <CalendarDays size={18} /> Academic Details
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <div className="flex items-center gap-3">
                        <Cake size={16} className="text-gray-500" />
                        <div>
                          <Text strong className="text-gray-600">
                            Date of Birth
                          </Text>
                          <Text className="block text-gray-800">
                            {students.dateOfBirth}
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className="flex items-center gap-3">
                        <ShieldAlert size={16} className="text-gray-500" />
                        <div>
                          <Text strong className="text-gray-600">
                            Status
                          </Text>
                          <Tag
                            color={students.isActive ? 'green' : 'red'}
                            className="rounded-full px-3"
                          >
                            {students.isActive ? 'Active' : 'Inactive'}
                          </Tag>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider className="my-6" />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card className="border-0 shadow-none">
              <Title
                level={4}
                className="mb-4 text-gray-800 flex items-center gap-2"
              >
                <Wallet size={18} /> Financial Information
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item label="Due Amount" className="text-gray-600">
                  <div className="flex items-center gap-2">
                    <Text
                      className={`text-lg ${
                        students.dueAmount > 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      ${students.dueAmount}
                    </Text>
                    {students.dueAmount > 0 && (
                      <Tag color="red" className="rounded-full">
                        Payment Due
                      </Tag>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Scholarship Status">
                  <Tag
                    color={students.scholarshipStatus ? 'green' : 'red'}
                    className="rounded-full px-3"
                  >
                    {students.scholarshipStatus
                      ? 'Scholarship Awarded'
                      : 'No Scholarship'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card className="border-0 shadow-none">
              <Title
                level={4}
                className="mb-4 text-gray-800 flex items-center gap-2"
              >
                <Contact size={18} /> Guardian Details
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item label="Name" className="text-gray-600">
                  <Text className="text-gray-800">{students.guardianName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  <Text className="text-gray-800">
                    {students.guardianContact}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  <Text className="text-red-600">
                    {students.emergencyContact}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Divider className="my-6" />

        <div className="text-center text-gray-500 text-sm">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile;
