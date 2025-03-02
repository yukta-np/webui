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
import { Layout, Menu, Drawer, Button } from 'antd';
import Link from 'next/link';
import { Footer } from 'antd/es/layout/layout';
import TopHeader from '../navbar/TopHeader';
import Sider from 'antd/es/layout/Sider';
import Cookies from 'universal-cookie';
import useWindowSize from '@/hooks/useWindowSize';
import { COOKIE_SIDEBER_COLLAPSED } from '@/constants';

const { Content } = Layout;

const SecuredLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  const size = useWindowSize();

  useEffect(() => {
    setCollapsed(cookies.get(COOKIE_SIDEBER_COLLAPSED) === 'true');
  }, []);

  const onCollapse = (value) => {
    cookies.set(COOKIE_SIDEBER_COLLAPSED, value, { path: '/' });
    setCollapsed(value);
  };

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const menuItems = [
    {
      label: 'Dashboard',
      key: 'dashboard',
      icon: <PieChartOutlined />,
      href: '/dashboard',
    },
    {
      label: 'Routine',
      key: 'routine',
      icon: <CalendarOutlined />,
      href: '/routine',
    },
    {
      label: 'Tasks',
      key: 'tasks',
      icon: <CheckCircleOutlined />,
      children: [
        {
          label: 'My Tasks',
          key: 'my-task',
          icon: <CheckCircleOutlined />,
          href: '/tasks/my-task',
        },
        {
          label: "My Team's Tasks",
          key: 'my-team',
          icon: <TeamOutlined />,
          href: '/tasks/my-team',
        },
        {
          label: 'All Tasks',
          key: 'AllTasks',
          icon: <UnorderedListOutlined />,
          href: '/tasks',
        },
      ],
    },
    {
      label: 'Leave Request',
      key: 'leave-request',
      icon: <FormOutlined />,
      children: [
        {
          label: 'My Request',
          key: 'my-leave-request',
          icon: <FormOutlined />,
          href: '/leave-request/my-leave',
        },
        {
          label: "Team's Request",
          key: 'my-team-leave-request',
          icon: <TeamOutlined />,
          href: '/leave-request/team-leave',
        },
        {
          label: 'All Request',
          key: 'all-leave-request',
          icon: <UnorderedListOutlined />,
          href: '/leave-request',
        },
      ],
    },
    {
      label: 'Documents',
      key: 'documents',
      icon: <FileTextOutlined />,
      href: '/documents',
    },
    {
      label: 'Announcements',
      key: 'announcements',
      icon: <NotificationOutlined />,
      href: '/announcements',
    },
    {
      label: 'Calendar',
      key: 'calendar',
      icon: <CalendarOutlined />,
      href: '/calendar',
    },
    {
      label: 'Settings',
      key: 'settings',
      icon: <SettingOutlined />,
      href: '/settings',
    },
  ];

  const renderMenu = (items) =>
    items.map(({ label, key, icon, href, children }) =>
      children
        ? { label, key, icon, children: renderMenu(children) }
        : { label: <Link href={href}>{label}</Link>, key, icon }
    );

  const sidebar = (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="md"
      collapsedWidth={80}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div className="p-2 flex items-center justify-center">
        <Link href="/">
          <img
            src={collapsed ? '/yuktaLogo.png' : '/yukta.png'}
            height={44}
            style={{ marginTop: '8px', transition: 'width 0.3s ease-in-out' }}
            alt="Yukta"
          />
        </Link>
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[router.route]}
        mode="inline"
        items={renderMenu(menuItems)}
      />
    </Sider>
  );

  const mobileMenu = (
    <>
      <Button
        type="primary"
        onClick={toggleDrawer}
        icon={drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      />
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={toggleDrawer}
        open={drawerVisible}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[router.route]}
          items={renderMenu(menuItems)}
          onClick={() => setDrawerVisible(false)}
        />
      </Drawer>
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {size.width > 768 ? sidebar : mobileMenu}
      <Layout
        className="site-layout"
        style={{
          minHeight: '100vh',
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <TopHeader />
        <Content className="content-container">{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          ©{new Date().getFullYear()} Yukta
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SecuredLayout;
