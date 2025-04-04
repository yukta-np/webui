'use client';
// StaffProfile.js
import {
  Typography,
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
  Briefcase,
  Contact,
  Award,
  Calendar,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';
import { getStaffById } from '@/services/staffs.http';
import { useEffect, useState } from 'react';
const { Title, Text } = Typography;

const StaffProfile = ({ params }) => {
  const router = useRouter();
  const id = params?.id;

  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchStaff = async () => {
      try {
        const response = await getStaffById(id);
        setStaff(response);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  if (!id) return <div>Loading staff ID...</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError || !staff) return <div>Failed to load staff data.</div>;

  return (
    <div className="p-6 gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-6">
          <Avatar
            src={staff.avatar}
            size={100}
            className="border-2 border-gray-200"
          />
          <div>
            <Title level={2} className="mb-1 text-gray-800">
              {`${staff.firstName} ${staff.lastName}`}
            </Title>
            <Text
              type="secondary"
              className="text-gray-500 text-lg flex items-center gap-2"
            >
              <GraduationCap size={18} />
              {staff.highestQualification}
            </Text>
          </div>
        </div>
        <Button
          type="default"
          onClick={() => router.push(`/staff/${params.id}/edit`)}
          className="flex items-center gap-2 border-gray-300 text-gray-600 hover:border-gray-400"
        >
          Edit Profile
        </Button>
      </div>

      <Divider className="my-6" />

      <Row gutter={[24, 24]} className="mb-8">
        {/* Personal Details Card */}
        <Col xs={24} md={8}>
          <Title level={4} className="mb-4 text-gray-800 flex items-center">
            <User size={20} className="mr-2" /> Personal Details
          </Title>
          <Descriptions column={1}>
            <Descriptions.Item label="Staff ID">{staff.id}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {staff.dateOfBirth}
            </Descriptions.Item>
            <Descriptions.Item label="Nationality">
              {staff.nationality}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={staff.isActive ? 'green' : 'red'}
                className="rounded-full"
              >
                {staff.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        {/* Employment Details Card */}
        <Col xs={24} md={8}>
          <Title level={4} className="mb-4 text-gray-800 flex items-center">
            <Briefcase size={20} className="mr-2" /> Employment Details
          </Title>
          <Descriptions column={1}>
            <Descriptions.Item label="Position">
              <Tag color={staff.isTeacher ? 'blue' : 'geekblue'}>
                {staff.isTeacher ? 'Teacher' : 'Staff'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Hire Date">
              {staff.hireDate}
            </Descriptions.Item>
            <Descriptions.Item label="Salary">
              <Text className="text-green-600">
                NRs {staff.salary?.toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Experience">
              {staff.experienceYears} years
            </Descriptions.Item>
          </Descriptions>
        </Col>

        {/* Contact Information Card */}
        <Col xs={24} md={8}>
          <Title level={4} className="mb-4 text-gray-800 flex items-center">
            <Contact size={20} className="mr-2" /> Contact Information
          </Title>
          <Descriptions column={1}>
            <Descriptions.Item label="Email">{staff.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">
              {staff.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Emergency Contact">
              {staff.emergencyContact}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {staff.address}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider className="my-6" />

      {/* Professional Details Section */}
      <Title level={4} className="mb-4 text-gray-800 flex items-center">
        <Award size={20} className="mr-2" /> Professional Details
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Descriptions column={1}>
            <Descriptions.Item label="Faculty ID">
              {staff.facultyId}
            </Descriptions.Item>
            <Descriptions.Item label="Academic Program">
              {staff.academicProgram}
            </Descriptions.Item>
            <Descriptions.Item label="Specialization">
              {staff.specialization}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} md={12}>
          <Descriptions column={1}>
            <Descriptions.Item label="Highest Qualification">
              {staff.highestQualification}
            </Descriptions.Item>
            <Descriptions.Item label="Years of Experience">
              {staff.experienceYears}
            </Descriptions.Item>
            <Descriptions.Item label="Employment Type">
              <Tag color="purple">Full-time</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </div>
  );
};

export default StaffProfile;
