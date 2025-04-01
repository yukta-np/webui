import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import Link from 'next/link';
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  CodeOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const settingsCards = [
  {
    id: 'administration',
    title: 'Administration',
    description: 'Manage administration staffs',
    icon: <UserOutlined className="text-blue-500 text-2xl" />,
    path: '/administration',
  },
  {
    id: 'students',
    title: 'Students',
    description: 'Manage student records',
    icon: <BookOutlined className="text-blue-500 text-2xl" />,
    path: '/students',
  },
  {
    id: 'teachers',
    title: 'Teachers',
    description: 'Manage teaching staffs',
    icon: <CodeOutlined className="text-blue-500 text-2xl" />,
    path: '/teachers',
  },
  {
    id: 'staffs',
    title: 'Staffs',
    description: 'Manage general staffs',
    icon: <TeamOutlined className="text-blue-500 text-2xl" />,
    path: '/staffs',
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
                      <Title level={5} style={{ margin: 0, color: '#3182CE' }}>
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
