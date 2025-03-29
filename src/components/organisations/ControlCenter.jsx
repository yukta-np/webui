import React from 'react';
import { Menu, Layout, Grid, theme, Breadcrumb } from 'antd';
import { ChartNoAxesGantt, User, Component, Settings } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Plans from './Plans'; // Adjust the import path as needed
import { useOrganisation } from '@/hooks/useOrganisation';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const ControlCenter = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const currentId = parseInt(router.query.id);
  const { organisation } = useOrganisation();

  const activeTab = router.pathname.split('/').pop() || 'plans';
  const orgName =
    organisation?.find((org) => org.id === currentId)?.name || 'Organisation';

  const menuItems = [
    {
      key: 'plans',
      icon: <ChartNoAxesGantt size={18} />,
      label: <Link href={`/organisations/${currentId}/plans`}>Plans</Link>,
    },
    {
      key: 'users',
      icon: <User size={18} />,
      label: <Link href={`/organisations/${currentId}/users`}>Users</Link>,
    },
    {
      key: 'modules',
      icon: <Component size={18} />,
      label: <Link href={`/organisations/${currentId}/modules`}>Modules</Link>,
    },
    {
      key: 'settings',
      icon: <Settings size={18} />,
      label: (
        <Link href={`/organisations/${currentId}/settings`}>Settings</Link>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'plans':
        return <Plans organisationId={currentId} />;
      case 'users':
        return <div>Users Content</div>;
      case 'modules':
        return <div>Modules Content</div>;
      case 'settings':
        return <div>Settings Content</div>;
      default:
        return <Plans organisationId={currentId} />;
    }
  };

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Organisations</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <p className="text-xl font-bold mb-4">{orgName}</p>
        <div style={{ display: 'flex' }}>
          <Menu
            mode="inline"
            style={{ width: 200, height: '60vh' }}
            items={menuItems}
          />
          <div style={{ padding: '24px', flex: 1 }}>
            <p
              className="
            text-xl font-semibold mb-4"
            >
              Organisation Information
            </p>
            <p>Main content area for </p>
          </div>
        </div>
        <div>{renderContent()}</div>
      </div>
    </Content>
  );
};

export default ControlCenter;
