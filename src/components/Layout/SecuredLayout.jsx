import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  ChartPie,
  Calendar,
  CalendarDays,
  CalendarX,
  CheckCircle,
  Users,
  List,
  UserX,
  FileStack,
  Megaphone,
  Settings,
  MessageCircle,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';
import { Layout, Menu, Drawer, Button } from 'antd';
import Link from 'next/link';
import { Footer } from 'antd/es/layout/layout';
import TopHeader from '../navbar/TopHeader';
import Sider from 'antd/es/layout/Sider';
import Cookies from 'universal-cookie';
import useWindowSize from '@/hooks/useWindowSize';
import { COOKIE_SIDEBER_COLLAPSED } from '@/constants';
import { CloseOutlined } from '@ant-design/icons';
import YuktaLogo from '@/svgs/yukta';

const { Content } = Layout;

const SecuredLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const size = useWindowSize();

  useEffect(() => {
    setCollapsed(true);
  }, []);

  const onCollapse = (value) => {
    setCollapsed(value);
  };

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const menuItems = [
    {
      label: 'Dashboard',
      key: 'dashboard',
      icon: <ChartPie size={18} />,
      href: '/dashboard',
    },
    {
      label: 'Routine',
      key: 'routine',
      icon: <CalendarDays size={18} />,
      href: '/routine',
    },
    {
      label: 'Tasks',
      key: 'tasks',
      icon: <CheckCircle size={18} />,
      children: [
        {
          label: 'My Tasks',
          key: 'my-task',
          icon: <CheckCircle size={18} />,
          href: '/tasks/my-task',
        },
        {
          label: "My Team's Tasks",
          key: 'my-team',
          icon: <Users size={18} />,
          href: '/tasks/my-team',
        },
        {
          label: 'All Tasks',
          key: 'AllTasks',
          icon: <List size={18} />,
          href: '/tasks',
        },
      ],
    },
    {
      label: 'Leave Request',
      key: 'leave-request',
      icon: <CalendarX size={18} />,
      children: [
        {
          label: 'My Request',
          key: 'my-leave-request',
          icon: <UserX size={18} />,
          href: '/leave-request/my-leave',
        },
        {
          label: "Team's Request",
          key: 'my-team-leave-request',
          icon: (
            <>
              <Users size={18} /> <CloseOutlined style={{ fontSize: '8px' }} />
            </>
          ),
          href: '/leave-request/team-leave',
        },
        {
          label: 'All Request',
          key: 'all-leave-request',
          icon: <CalendarX size={18} />,
          href: '/leave-request',
        },
      ],
    },
    {
      label: 'Documents',
      key: 'documents',
      icon: <FileStack size={18} />,
      href: '/documents',
    },
    {
      label: 'Announcements',
      key: 'announcements',
      icon: <Megaphone size={18} />,
      href: '/announcements',
    },
    {
      label: 'Calendar',
      key: 'calendar',
      icon: <Calendar size={18} />,
      href: '/calendar',
    },
    {
      label: 'Class Room',
      key: 'class-room',
      icon: <PanelLeftOpen size={18} />,
      href: '/class-room',
    },
    {
      label: 'Settings',
      key: 'settings',
      icon: <Settings size={18} />,
      href: '/settings',
    },
    {
      label: 'Permission Groups',
      key: 'permission-groups',
      icon: <PanelLeftClose size={18} />,
      href: '/permission-groups',
    },
    {
      label: 'Feedback',
      key: 'feedback',
      icon: <MessageCircle size={18} />,
      href: '/feedback',
    },
    {
      label: 'Groups',
      key: 'groups',
      icon: <Users size={18} />,
      href: '/groups',
    }
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
        padding: '1.5rem 0',
      }}
    >
      <div>
        <Link href="/" className={`block mx-auto mb-6 w-max text-gray-100 `}>
          <YuktaLogo
            height="40px"
            style={{
              transition: 'all 0.3s ease-in-out',
              display: 'inline-block',
              transform: collapsed
                ? 'translateX(14px) scale(0.8)'
                : 'translateX(0) scale(1)',
            }}
          />
          <h1
            className="inline-block text-3xl font-bold text-current"
            style={{
              transition: 'all 0.3s ease-in-out',
              verticalAlign: 'middle',
              transform: collapsed ? 'scaleY(0)' : 'scaleY(1)',
              opacity: collapsed ? '0' : '1',
              visibility: collapsed ? 'hidden' : 'visible',
            }}
          >
            Yukta
          </h1>
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
        icon={drawerVisible ? <PanelLeftOpen /> : <PanelLeftClose />}
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
          <p>&copy; {new Date().getFullYear()} Yukta. All rights reserved.</p>
          <p>Precision. Strength. SaaS Solutions – The Ant Way.</p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SecuredLayout;
