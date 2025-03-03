import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  ChartPie,
  CalendarDays,
  CheckCircle,
  Users,
  List,
  CalendarX,
  UserX,
  FileStack,
  Megaphone,
  Calendar,
  Settings,
} from 'lucide-react';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', 'dashboard', <ChartPie />),
  getItem('Routine', 'routine', <CalendarDays />),
  getItem('Tasks', 'tasks', <CheckCircle />, [
    getItem('My Tasks', 'my-task', <CheckCircle />),
    getItem("My Team's Tasks", 'my-team', <Users />),
    getItem('All Tasks', 'all-tasks', <List />),
  ]),
  getItem('Leave Request', 'leave-request', <CalendarX />, [
    getItem('My Leave Request', 'my-leave-request', <UserX />),
    getItem(
      "My Team's Leave Request",
      'my-team-leave-request',
      <>
        <UserX />
        <UserX /> {/* Yesko CSS milao hai... 😂*/}
      </>
    ),
  ]),
  getItem('Documents', 'documents', <FileStack />),
  getItem('Announcements', 'announcements', <Megaphone />),
  getItem('Calendar', 'calendar', <Calendar />),
  getItem('Settings', 'settings', <Settings />),
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth={65}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={['dashboard']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
