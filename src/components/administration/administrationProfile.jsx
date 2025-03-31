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
  Briefcase,
  Cake,
  CalendarDays,
  ShieldAlert,
  DollarSign,
  GraduationCap,
  BookOpen,
  Clock,
  FirstAidKit,
} from 'lucide-react';
import { BankFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdministrationProfile = ({ params }) => {
  const router = useRouter();
  // In real implementation, replace with your actual data fetching hook
  const administration = {
    // Sample data
    firstName: 'John',
    middleName: 'A',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-05-15T00:00:00.000Z',
    isTeacher: true,
    nationality: 'American',
    address: '123 Main St, Springfield',
    facultyId: 1,
    academicProgram: 101,
    hireDate: '2022-09-01T00:00:00.000Z',
    salary: 50000,
    isActive: true,
    avatar: 'https://example.com/avatar.jpg',
    userId: 10,
    highestQualification: 'PhD in Computer Science',
    specialization: 'Artificial Intelligence',
    experienceYears: 10,
    emergencyContact: '+9876543210',
  };

  // Simulated loading state
  const isLoading = false;
  const isError = false;

  if (isLoading)
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );

  if (isError)
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="text-center">
          <Title level={3} className="mb-4 text-red-600">
            Loading Error
          </Title>
          <Text className="mb-4 block text-gray-600">
            Failed to load staff data. Please try again later.
          </Text>
          <Button type="primary" onClick={() => router.push('/administration')}>
            Return to Staff Directory
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb className="mb-6 text-sm">
        <Breadcrumb.Item>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            href="/administration"
            className="text-gray-500 hover:text-gray-700"
          >
            Staff
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="text-gray-700 font-medium">
          {administration.firstName} {administration.lastName}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card
        className="shadow-sm border-0"
        cover={
          administration.avatar && (
            <div className="h-48 bg-gray-50 overflow-hidden flex items-center justify-center border-b">
              <Image
                src={administration.avatar}
                alt="Staff avatar"
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
              {administration.firstName} {administration.middleName}{' '}
              {administration.lastName}
            </Title>
            <Text
              type="secondary"
              className="text-gray-500 text-lg flex items-center gap-2"
            >
              <Briefcase size={18} />
              {administration.isTeacher
                ? 'Teaching Staff'
                : 'Administrative Staff'}
            </Text>
          </div>
          <Button
            type="default"
            icon={<FilePenLine size={16} />}
            onClick={() => router.push(`/administration/${params.id}/edit`)}
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
                    Employee ID
                  </Text>
                  <Text className="block text-gray-800">
                    #{administration.userId}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-500" />
                <div>
                  <Text strong className="text-gray-600">
                    Experience
                  </Text>
                  <Text className="block text-gray-800">
                    {administration.experienceYears} years
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
                    #{administration.facultyId}
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
                    <Contact size={18} /> Personal Information
                  </Title>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Email" className="text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500" />
                        <Text className="text-gray-800">
                          {administration.email}
                        </Text>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <Text className="text-gray-800">
                          {administration.phoneNumber}
                        </Text>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-gray-500" />
                        <Text className="text-gray-800">
                          {administration.address}
                        </Text>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Date of Birth">
                      <div className="flex items-center gap-2">
                        <Cake size={16} className="text-gray-500" />
                        <Text className="text-gray-800">
                          {new Date(
                            administration.dateOfBirth
                          ).toLocaleDateString()}
                        </Text>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Nationality">
                      <Tag color="blue" className="rounded-full">
                        {administration.nationality}
                      </Tag>
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
                    <GraduationCap size={18} /> Professional Information
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <div className="flex items-center gap-3">
                        <CalendarDays size={16} className="text-gray-500" />
                        <div>
                          <Text strong className="text-gray-600">
                            Hire Date
                          </Text>
                          <Text className="block text-gray-800">
                            {new Date(
                              administration.hireDate
                            ).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className="flex items-center gap-3">
                        <ShieldAlert size={16} className="text-gray-500" />
                        <div>
                          <Text strong className="text-gray-600">
                            Employment Status
                          </Text>
                          <Tag
                            color={administration.isActive ? 'green' : 'red'}
                            className="rounded-full px-3"
                          >
                            {administration.isActive ? 'Active' : 'Inactive'}
                          </Tag>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-gray-500" />
                        <div>
                          <Text strong className="text-gray-600">
                            Highest Qualification
                          </Text>
                          <Text className="block text-gray-800">
                            {administration.highestQualification}
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className="flex items-center gap-3">
                        <Briefcase size={16} className="text-gray-500" />
                        <div>
                          <Text strong className="text-gray-600">
                            Specialization
                          </Text>
                          <Text className="block text-gray-800">
                            {administration.specialization}
                          </Text>
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
                <DollarSign size={18} /> Compensation
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item
                  label="Annual Salary"
                  className="text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <Text className="text-lg text-green-600">
                      ${administration.salary.toLocaleString()}
                    </Text>
                    <Tag color="green" className="rounded-full">
                      Current
                    </Tag>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag color="green" className="rounded-full px-3">
                    Regular
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
                <FirstAidKit size={18} /> Emergency Contact
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item
                  label="Contact Number"
                  className="text-gray-600"
                >
                  <Text className="text-red-600">
                    {administration.emergencyContact}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Relation">
                  <Text className="text-gray-800">Emergency Contact</Text>
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

export default AdministrationProfile;
