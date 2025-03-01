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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { COOKIE_SIDEBER_COLLAPSED } from '@/constants';
import { Layout, Menu, Drawer, Button } from 'antd';
import Link from 'next/link';
import { Footer } from 'antd/es/layout/layout';
import TopHeader from '../navbar/TopHeader';
import Sider from 'antd/es/layout/Sider';
import Cookies from 'universal-cookie';
import useWindowSize from '@/hooks/useWindowSize';

const SecuredLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  const size = useWindowSize();

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
          label: <Link href="/tasks/my-task">My Tasks</Link>,
          key: 'my-task',
          icon: <CheckCircleOutlined />,
        },
        {
          label: <Link href="/tasks/my-team">My Team's Tasks</Link>,
          key: 'my-team',
          icon: <TeamOutlined />,
        },
        {
          label: <Link href="/tasks">All Tasks</Link>,
          key: 'tasks',
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
          label: <Link href="/leave-request/my-leave">My Request</Link>,
          key: 'my-leave-request',
          icon: <FormOutlined />,
        },
        {
          label: <Link href="/leave-request/team-leave">Team's Request</Link>,
          key: 'my-team-leave-request',
          icon: <TeamOutlined />,
        },
        {
          label: <Link href="/leave-request">All Request</Link>,
          key: 'all-leave-request',
          icon: <UnorderedListOutlined />,
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

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const orgSidebar = () => (
    <>
      {size.width > 768 ? (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          breakpoint="md"
          collapsedWidth="80"
        >
          <div className="logo bg-white p-2 flex items-center justify-center">
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
            items={items}
          />
        </Sider>
      ) : (
        <>
          <Button
            className="menu-button"
            type="primary"
            onClick={toggleDrawer}
            icon={drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={toggleDrawer}
            open={drawerVisible}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={[router.route]}
              items={items}
              onClick={() => setDrawerVisible(false)}
            />
          </Drawer>
        </>
      )}
    </>
  );

  const footer = (
    <Layout className="site-layout">
      <TopHeader />
      <div className="content-container">{props.children}</div>
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
