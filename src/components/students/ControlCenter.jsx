import React from 'react';
import { Menu, Layout, Grid, theme, Breadcrumb } from 'antd';
import {
  ChartNoAxesGantt,
  User,
  Component,
  Settings,
  BookUser,
} from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useStudents } from '@/hooks/useStudents';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const ControlCenter = ({ children }) => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const currentId = parseInt(router.query.id);
  const { students } = useStudents();

  const studentName = students?.find((s) => s.id === currentId)?.name || 'Student';
  const isValidId = !isNaN(currentId);


  const menuItems = [
    {
      key: 'details',
      icon: <BookUser size={18} />,
      label: isValidId ? <Link href={`/students/${currentId}`}>Details</Link> : null,
    },
    {
      key: 'courses',
      icon: <ChartNoAxesGantt size={18} />,
      label: <Link href={`/students/${currentId}/courses`}>Courses</Link>,
    },
    {
      key: 'modules',
      icon: <Component size={18} />,
      label: <Link href={`/students/${currentId}/modules`}>Modules</Link>,
    },
    {
      key: 'settings',
      icon: <Settings size={18} />,
      label: <Link href={`/students/${currentId}/settings`}>Settings</Link>,
    },
  ];

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/students">Students</Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <p className="text-xl font-bold mb-4">{isValidId ? studentName : 'Loading student...'}</p>
        <div className="grid grid-cols-12">
          <Menu
            mode="inline"
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
export default ControlCenter;
