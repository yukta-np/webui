import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpenText,
  BookText,
  Landmark,
  ShieldUser,
  UserPen,
  Users,
  CircleUserRound,
} from 'lucide-react';

const { Title, Text } = Typography;

const settingsCards = [
  {
    id: 'administration',
    title: 'Administration',
    description: 'Manage administration staffs',
    icon: <ShieldUser size={32} className="text-blue-500 text-2xl" />,
    path: '/administration',
  },
  {
    id: 'students',
    title: 'Students',
    description: 'Manage student records',
    icon: <CircleUserRound size={32} className="text-blue-500 text-2xl" />,
    path: '/students',
  },
  {
    id: 'teachers',
    title: 'Teachers',
    description: 'Manage teaching staffs',
    icon: <UserPen size={32} className="text-blue-500 text-2xl" />,
    path: '/teachers',
  },
  {
    id: 'staffs',
    title: 'Staffs',
    description: 'Manage general staffs',
    icon: <Users size={32} className="text-blue-500 text-2xl" />,
    path: '/staffs',
  },
  {
    id: 'faculties',
    title: 'Faculties',
    description: 'Manage faculties',
    icon: <GraduationCap size={32} className="text-blue-500 text-2xl" />,
    path: '/faculties',
  },
  {
    id: 'academic-programs',
    title: 'Academic Programs',
    description: 'Manage academic programs',
    icon: <BookOpenText size={32} className="text-blue-500 text-2xl" />,
    path: '/academic-programs',
  },
  {
    id: 'academic-subjects',
    title: 'Academic Subjects',
    description: 'Manage academic subjects',
    icon: <BookText size={32} className="text-blue-500 text-2xl" />,
    path: '/academic-subjects',
  },
  {
    id: 'universities',
    title: 'Universities',
    description: 'Manage universities',
    icon: <Landmark size={32} className="text-blue-500 text-2xl" />,
    path: '/universities',
  },
];

const Datasources = () => {
  return (
    <div className="p-6">
      <Card className="p-4 rounded-lg shadow-sm">
        <Row gutter={[24, 24]}>
          {settingsCards.map((card) => (
            <Col xs={24} sm={12} md={8} lg={6} key={card.id}>
              <Link href={card.path}>
                <Card hoverable className="h-full border-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">{card.icon}</div>
                    <div>
                      <Title level={5} style={{ margin: 0, color: '#1677ff' }}>
                        {card.title}
                      </Title>
                      <Text type="secondary">{card.description}</Text>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Datasources;
