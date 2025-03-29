// app/students/[id]/page.jsx

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
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentForm from '@/components/students/StudentForm';
import {
  FilePenLine,
  Mail,
  Phone,
  Home,
  User,
  GraduationCap,
} from 'lucide-react';
const initialStudentData = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    faculty: 'BBA',
    program: 'Computer Science',
    startDate: '2023-08-15',
    phoneNumber: '+1234567890',
    dateOfBirth: '2000-01-01',
    nationality: 'American',
    address: '123 Main Street, City, Country',
    batchNumber: '2025A',
  },
  {
    key: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    faculty: 'Arts',
    program: 'English Literature',
    startDate: '2023-02-01',
    phoneNumber: '+1987654321',
    dateOfBirth: '2001-05-15',
    nationality: 'Canadian',
    address: '456 Oak Street, City, Country',
    batchNumber: '2025B',
  },
];

const { Title, Text } = Typography;

const StudentProfile = ({ params }) => {
  const router = useRouter();
  const student = initialStudentData.find((s) => s.key === params.id);

  if (!student) {
    return (
      <div className="p-6">
        <Card className="text-center">
          <Title level={3} className="mb-4">
            Student Not Found
          </Title>
          <Text className="mb-4 block">
            The requested student does not exist or has been removed.
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
          {student.firstName} {student.lastName}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card
        className="shadow-lg"
        cover={
          student.avatar && (
            <div className="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
              <Image
                src={student.avatar}
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
              {student.firstName} {student.middleName} {student.lastName}
            </Title>
            <Text type="secondary" className="text-lg">
              {student.faculty} - {student.program}
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

        {/* Quick Info Panel */}
        <Card.Grid className="w-full hover:shadow-none">
          <Row gutter={24}>
            <Col span={8}>
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-500" />
                <Text strong>Student ID:</Text>
                <Text>{student.key}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-gray-500" />
                <Text strong>Batch:</Text>
                <Text>{student.batchNumber}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="flex items-center gap-2">
                <Bank size={18} className="text-gray-500" />
                <Text strong>Faculty ID:</Text>
                <Text>{student.facultyId}</Text>
              </div>
            </Col>
          </Row>
        </Card.Grid>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div>
            <Card title="Personal Information" className="mb-6">
              <Descriptions column={1}>
                <Descriptions.Item label="Email">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <Text>{student.email}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <Text>{student.phoneNumber}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  <div className="flex items-center gap-2">
                    <Home size={16} />
                    <Text>{student.address}</Text>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  <Text>{student.dateOfBirth}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Nationality">
                  <Tag color="blue">{student.nationality}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Academic Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Enrollment Date">
                  <Text>{student.enrollmentDate}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Expected Graduation">
                  <Text>{student.graduationDate}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={student.isActive ? 'green' : 'red'}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Class Representative">
                  <Tag color={student.isCr ? 'geekblue' : 'default'}>
                    {student.isCr ? 'Yes' : 'No'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Right Column */}
          <div>
            <Card title="Financial Information" className="mb-6">
              <Descriptions column={1}>
                <Descriptions.Item label="Due Amount">
                  <Text type={student.dueAmount > 0 ? 'danger' : 'success'}>
                    ${student.dueAmount}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Scholarship Status">
                  <Tag color={student.scholarshipStatus ? 'green' : 'red'}>
                    {student.scholarshipStatus ? 'Awarded' : 'Not Awarded'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Guardian Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Name">
                  <Text>{student.guardianName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  <Text>{student.guardianContact}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  <Text>{student.emergencyContact}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="User ID">
                  <Text>{student.guardianUserId}</Text>
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
