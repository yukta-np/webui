import React from 'react';
import { Layout, Menu, Grid, theme } from 'antd';
import Link from 'next/link';
import {
  User,
  Briefcase,
  FileText,
  Megaphone,
  BookOpen,
  AlertOctagon,
  BarChart,
} from 'lucide-react';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const StaffLayout = ({ children, staffId }) => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'details',
      icon: <User size={18} />,
      label: <Link href={`/staff/${staffId}`}>Profile</Link>,
    },
    {
      key: 'employment',
      icon: <Briefcase size={18} />,
      label: <Link href={`/staff/${staffId}/employment`}>Employment</Link>,
    },
    {
      key: 'documents',
      icon: <FileText size={18} />,
      label: <Link href={`/staff/${staffId}/documents`}>Documents</Link>,
    },
    {
      key: 'observations',
      icon: <BookOpen size={18} />,
      label: <Link href={`/staff/${staffId}/observations`}>Observations</Link>,
    },
    {
      key: 'performance',
      icon: <BarChart size={18} />,
      label: <Link href={`/staff/${staffId}/performance`}>Performance</Link>,
    },
    {
      key: 'disciplinary',
      icon: <AlertOctagon size={18} />,
      label: <Link href={`/staff/${staffId}/disciplinary`}>Disciplinary</Link>,
    },
    {
      key: 'training',
      icon: <Megaphone size={18} />,
      label: <Link href={`/staff/${staffId}/training`}>Training</Link>,
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

export default StaffLayout;
