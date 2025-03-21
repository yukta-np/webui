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
      <div>
        <Link href="/">
          {/* <img
            src={collapsed ? '/yuktaLogo.png' : '/yukta.png'}
            height={44}
            style={{ marginTop: '8px', transition: 'width 0.3s ease-in-out' }}
            alt="Yukta"
          /> */}
          <svg
            width="35"
            height="100"
            viewBox="0 0 599 770"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              marginLeft: '23px',
              transition: 'width 0.3s ease-in-out',
            }}
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M71.3432 478.832C68.219 475.708 68.2189 470.642 71.3431 467.518L305.205 233.657C308.329 230.532 313.394 230.532 316.518 233.657L550.38 467.518C553.504 470.642 553.504 475.708 550.38 478.832L424.771 604.441C422.199 607.012 421.686 610.995 423.52 614.134L491.332 730.169C495.791 737.798 493.22 747.597 485.591 752.056L456.801 768.881C452.986 771.11 448.087 769.825 445.857 766.01L383.716 659.679C381.071 655.153 374.86 654.352 371.153 658.059L316.518 712.693C313.394 715.817 308.329 715.817 305.205 712.693L251.24 658.729C247.533 655.022 241.322 655.823 238.676 660.349L176.927 766.01C174.697 769.825 169.798 771.11 165.983 768.881L137.193 752.056C129.564 747.597 126.993 737.798 131.452 730.169L198.872 614.804C200.707 611.664 200.193 607.682 197.622 605.111L71.3432 478.832Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M84.2393 219.811C84.184 219.756 84.184 219.666 84.2393 219.611V219.611C84.2946 219.555 84.2946 219.466 84.2393 219.41L2.34314 137.514C-0.781049 134.39 -0.781047 129.325 2.34314 126.2L31.5793 96.9643C34.7035 93.8401 39.7688 93.8401 42.893 96.9643L119.232 173.304C122.357 176.428 127.422 176.428 130.546 173.304L301.507 2.34315C304.631 -0.781046 309.696 -0.781052 312.82 2.34314L483.686 173.209C486.81 176.333 491.876 176.333 495 173.209L555.474 112.734C558.599 109.61 563.664 109.61 566.788 112.734L596.024 141.971C599.148 145.095 599.149 150.16 596.024 153.284L530.04 219.268C529.959 219.35 529.959 219.482 530.04 219.563V219.563C530.122 219.645 530.122 219.777 530.04 219.858L312.82 437.078C309.696 440.202 304.631 440.202 301.507 437.078L84.2393 219.811ZM292 201.686C292 221.016 276.33 236.686 257 236.686C237.67 236.686 222 221.016 222 201.686C222 182.356 237.67 166.686 257 166.686C276.33 166.686 292 182.356 292 201.686ZM364 236.686C383.33 236.686 399 221.016 399 201.686C399 182.356 383.33 166.686 364 166.686C344.67 166.686 329 182.356 329 201.686C329 221.016 344.67 236.686 364 236.686Z"
              fill="white"
            />
          </svg>
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
          ©{new Date().getFullYear()} Yukta
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SecuredLayout;
