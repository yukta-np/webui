import React, { useState } from 'react'
import { Layout, Menu } from 'antd';
import {
   DesktopOutlined,
   FileOutlined,
   PieChartOutlined,
   TeamOutlined,
   UserOutlined,
} from '@ant-design/icons';

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
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Routine', '2', <DesktopOutlined />),
  getItem('Tasks', '3', <UserOutlined />, [
    getItem('My Tasks', '4'),
    getItem("My Team's Tasks", '5'),
    getItem('All Tasks', '6'),
  ]),
  getItem('Leave Request', '7', <TeamOutlined />, [
    getItem('My Leave Request', '8'),
    getItem("My Team's Leave Request", '9'),
  ]),
  getItem('Documents', '10', <FileOutlined />),
  getItem('Announcements', '11', <FileOutlined />),
  getItem('Calender', '12', <FileOutlined />),
  getItem('Settings', '13', <FileOutlined />),
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
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
}

export default Sidebar
