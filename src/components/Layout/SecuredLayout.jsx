import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  PieChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  FormOutlined,
  FileTextOutlined,
  NotificationOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { COOKIE_SIDEBER_COLLAPSED } from '@/constants';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { Footer } from 'antd/es/layout/layout';
import TopHeader from '../NavBar/TopHeader';
import Sider from 'antd/es/layout/Sider';
import Cookies from 'universal-cookie';

const SecuredLayout = (props) => {
  const [collapsed, setCollapsed] = useState();
  const [loggedUser, setLoggedUser] = useState();
  const router = useRouter();
  const cookies = new Cookies();

  const items = [
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: 'dashboard',
      icon: <PieChartOutlined />,
    },
    {
      label: <Link href="/routine">Routine</Link>,
      key: 'routine',
      icon: <CalendarOutlined />,
    },
    {
      label: 'Tasks',
      key: 'tasks',
      icon: <CheckCircleOutlined />,
      children: [
        {
          label: <Link href="/my-tasks">My Tasks</Link>,
          key: 'my-tasks',
          icon: <CheckCircleOutlined />,
        },
        {
          label: <Link href="/my-team-tasks">My Team's Tasks</Link>,
          key: 'my-team-tasks',
          icon: <TeamOutlined />,
        },
        {
          label: <Link href="/all-tasks">All Tasks</Link>,
          key: 'all-tasks',
          icon: <UnorderedListOutlined />,
        },
      ],
    },
    {
      label: 'Leave Request',
      key: 'leave-request',
      icon: <FormOutlined />,
      children: [
        {
          label: <Link href="/my-leave-request">My Leave Request</Link>,
          key: 'my-leave-request',
          icon: <FormOutlined />,
        },
        {
          label: (
            <Link href="/my-team-leave-request">My Team's Leave Request</Link>
          ),
          key: 'my-team-leave-request',
          icon: <TeamOutlined />,
        },
      ],
    },
    {
      label: <Link href="/documents">Documents</Link>,
      key: 'documents',
      icon: <FileTextOutlined />,
    },
    {
      label: <Link href="/announcements">Announcements</Link>,
      key: 'announcements',
      icon: <NotificationOutlined />,
    },
    {
      label: <Link href="/calender">Calender</Link>,
      key: 'calender',
      icon: <CalendarOutlined />,
    },
    {
      label: <Link href="/settings">Settings</Link>,
      key: 'settings',
      icon: <SettingOutlined />,
    },
  ];

  const onCollapse = (collapsed) => {
    cookies.set(COOKIE_SIDEBER_COLLAPSED, collapsed, { path: '/' });
    setCollapsed(collapsed);
  };

  useEffect(() => {
    setCollapsed(cookies.get(COOKIE_SIDEBER_COLLAPSED) === 'true');
  }, []);

  const orgSidebar = () => {
    let filteredItems = items;

    return (
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        zeroWidthTriggerStyle={{ display: collapsed ? 'none' : undefined }}
      >
        <div
          className="logo bg-white p-2 flex items-center justify-center"
          style={{ height: 64, display: 'flex', justifyContent: 'center' }}
        >
          <Link href="/">
            <img
              src={collapsed ? '/yuktaLogo.png' : '/yukta.png'}
              height={44}
              style={{ marginTop: '8px', transition: 'width 0.3s' }}
              alt="Yukta"
            />
          </Link>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[router.route]}
          mode="inline"
          items={filteredItems}
        />
      </Sider>
    );
  };

  const footer = (
    <Layout className="site-layout">
      <TopHeader />
      {props.children}
      <Footer style={{ textAlign: 'center' }}>
        ©{new Date().getFullYear()} Yukta
      </Footer>
    </Layout>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {orgSidebar()}
      {footer}
    </Layout>
  );
};

export default SecuredLayout;
