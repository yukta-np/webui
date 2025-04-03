import React from 'react';
import { Layout, Menu, Breadcrumb, Grid, theme } from 'antd';
import Link from 'next/link';
import {
  User,
  FileText,
  Book,
  FormInput,
  Target,
  AlertCircle,
  Clock,
} from 'lucide-react';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const StudentLayout = ({ children, studentId }) => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'details',
      icon: <User size={18} />,
      label: <Link href={`/students/${studentId}`}>Details</Link>,
    },
    {
      key: 'documents',
      icon: <FileText size={18} />,
      label: <Link href={`/students/${studentId}/documents`}>Documents</Link>,
    },
    {
      key: 'casenotes',
      icon: <Book size={18} />,
      label: <Link href={`/students/${studentId}/casenotes`}>Case Notes</Link>,
    },
    {
      key: 'forms',
      icon: <FormInput size={18} />,
      label: <Link href={`/students/${studentId}/forms`}>Forms</Link>,
    },
    {
      key: 'goals',
      icon: <Target size={18} />,
      label: <Link href={`/students/${studentId}/goals`}>Goals</Link>,
    },
    {
      key: 'incidents',
      icon: <AlertCircle size={18} />,
      label: <Link href={`/students/${studentId}/incidents`}>Incidents</Link>,
    },
    {
      key: 'sessions',
      icon: <Clock size={18} />,
      label: <Link href={`/students/${studentId}/sessions`}>Sessions</Link>,
    },
  ];

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="grid grid-cols-12">
          <Menu
            mode="inline"
            defaultSelectedKeys={['details']}
            style={{ width: screens.xs ? 180 : 200, height: '60vh' }}
            items={menuItems}
            className="col-span-2"
          />
          <div className="col-span-10">{children}</div>
        </div>
      </div>
    </Content>
  );
};

export default StudentLayout;
