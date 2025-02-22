import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Table, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
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
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <a href="javascript:;">View</a>
      ),
    }
  ];

  const data = [
    {
      key: '1',
      title: 'Fix login bug',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'John Doe',
      dueDate: '2025-02-28',
    },
    {
      key: '2',
      title: 'Design new UI',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Jane Smith',
      dueDate: '2025-03-05',
    },
    {
      key: '3',
      title: 'Write API documentation',
      status: 'Completed',
      priority: 'Low',
      assignedTo: 'Emily Davis',
      dueDate: '2025-02-20',
    },
    {
      key: '4',
      title: 'Implement payment gateway',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Michael Brown',
      dueDate: '2025-03-10',
    },
  ];
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
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
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Table
              selections={true}
              rowSelection={{
                  type: 'checkbox',
              }}
              rowKey={(record) => record.key}
              bordered
              columns={columns}
              dataSource={data}
              pagination={true}
            />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
