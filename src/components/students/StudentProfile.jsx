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
import { getStudentById } from '@/services/students.http';
import { useEffect, useState } from 'react';
const { Title, Text } = Typography;

const StudentProfile = ({ params }) => {
  const router = useRouter();
  const id = params?.id;

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        const response = await getStudentById(id);
        setStudent(response);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (!id) return <div>Loading student ID...</div>;

  if (isLoading) return <div>Loading...</div>;

  if (isError || !student) return <div>Failed to load student data.</div>;

  return (
    <div className="p-6 gap-4">
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
                {student?.firstName} {student?.middleName} {student?.lastName}
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
                    className={` ${
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
