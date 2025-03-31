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
} from 'lucide-react';
import { BankFilled } from '@ant-design/icons';
import { useStudents } from '@/hooks/useStudents';


const { Title, Text } = Typography;


const StudentProfile = ({ params }) => {
  const router = useRouter();
  const { students, isLoading, isError } = useStudents({ }, params.id);
  console.log('params', params.id);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading students data.</p>;

console.log('students', students?.id);
  if (!students) {
    return (
      <div className="p-6">
        <Card className="text-center">
          <Title level={3} className="mb-4">
            Student Not Found
          </Title>
          <Text className="mb-4 block">
            The requested students does not exist or has been removed.
          </Text>
          <Button type="primary" onClick={() => router.push('/students')}>
            Return to Student List
          </Button>
        </Card>
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
          {students.firstName} {students.lastName}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card
        className="shadow-lg"
        cover={
          students.avatar && (
            <div className="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
              <Image
                src={students.avatar}
                alt="Student avatar"
                preview={false}
                className="object-cover"
              />
            </div>
          )
        }
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <Title level={2} className="mb-0">
              {students.firstName} {students.middleName} {students.lastName}
            </Title>
            <Text type="secondary" className="text-lg">
              {students.faculty} - {students.program}
            </Text>
          </div>
          <Button
            type="primary"
            icon={<FilePenLine size={16} />}
            onClick={() => router.push(`/students/${params.id}/edit`)}
          >
            Edit Profile
          </Button>
        </div>

        <Card.Grid className="w-full hover:shadow-none">
          <Row gutter={24}>
            <Col span={8}>
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-500" />
                <Text strong>Student ID:</Text>
                <Text>{students.id}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-gray-500" />
                <Text strong>Batch:</Text>
                <Text>{students.batchNumber}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="flex items-center gap-2">
                <BankFilled size={18} className="text-gray-500" />
                <Text strong>Faculty ID:</Text>
                <Text>{students.facultyId}</Text>
              </div>
            </Col>
          </Row>
        </Card.Grid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <Card title="Personal Information" className="mb-6">
              <Descriptions column={1}>
                <Descriptions.Item label="Email">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <Text>{students.email}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <Text>{students.phoneNumber}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  <div className="flex items-center gap-2">
                    <Home size={16} />
                    <Text>{students.address}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  <Text>{students.dateOfBirth}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Nationality">
                  <Tag color="blue">{students.nationality}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Academic Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Enrollment Date">
                  <Text>{students.enrollmentDate}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Expected Graduation">
                  <Text>{students.graduationDate}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={students.isActive ? 'green' : 'red'}>
                    {students.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Class Representative">
                  <Tag color={students.isCr ? 'geekblue' : 'default'}>
                    {students.isCr ? 'Yes' : 'No'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          <div>
            <Card title="Financial Information" className="mb-6">
              <Descriptions column={1}>
                <Descriptions.Item label="Due Amount">
                  <Text type={students.dueAmount > 0 ? 'danger' : 'success'}>
                    ${students.dueAmount}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Scholarship Status">
                  <Tag color={students.scholarshipStatus ? 'green' : 'red'}>
                    {students.scholarshipStatus ? 'Awarded' : 'Not Awarded'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Guardian Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Name">
                  <Text>{students.guardianName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  <Text>{students.guardianContact}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  <Text>{students.emergencyContact}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        </div>

        <Divider />

        <div className="text-center">
          <Text type="secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile;
