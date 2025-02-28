import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DesktopOutlined } from '@ant-design/icons';
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
      icon: <DesktopOutlined />,
    },
    {
      label: <Link href="/routine">Routine</Link>,
      key: 'routine',
      icon: <DesktopOutlined />,
    },
    {
      label: 'Tasks',
      key: 'tasks',
      icon: <DesktopOutlined />,
      childern: [
        {
          label: <Link href="/my-tasks">My Tasks</Link>,
          key: 'my-tasks',
          icon: <DesktopOutlined />,
        },
        {
          label: <Link href="/my-tasks">My Team's Tasks</Link>,
          key: 'my-team-tasks',
          icon: <DesktopOutlined />,
        },
        {
          label: <Link href="/all-tasks">All Tasks</Link>,
          key: 'all-tasks',
          icon: <DesktopOutlined />,
        },
      ],
    },
    {
      label: <Link href="/leave-request">Leave Request</Link>,
      key: 'leave-request',
      icon: <DesktopOutlined />,
      childern: [
        {
          label: <Link href="/my-leave-request">My Leave Request</Link>,
          key: 'my-leave-request',
          icon: <DesktopOutlined />,
        },
        {
          label: <Link href="/my-leave-request">My Team's Leave Request</Link>,
          key: 'my-team-leave-request',
          icon: <DesktopOutlined />,
        },
      ],
    },
    {
      label: <Link href="/documents">Documents</Link>,
      key: 'documents',
      icon: <DesktopOutlined />,
    },
    {
      label: <Link href="/announcements">Announcements</Link>,
      key: 'announcements',
      icon: <DesktopOutlined />,
    },
    {
      label: <Link href="/calender">Calender</Link>,
      key: 'calender',
      icon: <DesktopOutlined />,
    },
    {
      label: <Link href="/settings">Settings</Link>,
      key: 'settings',
      icon: <DesktopOutlined />,
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
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} zeroWidthTriggerStyle={{ display: collapsed ? 'none' : undefined }}>
        <div className="logo bg-white ">
          <Link href="/">
            <img src="/next.png" height={70} alt="Yukta"  />
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
