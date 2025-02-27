import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, Table, theme } from 'antd';
import Sidebar from '../sidebar/Sidebar';
import TopHeader from '../NavBar/TopHeader';
const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
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
      render: () => <a href="javascript:;">View</a>,
    },
  ];

  const data = [
    {
      key: 1,
      title: 'Fix login bug',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'John Doe',
      dueDate: '2025-02-28',
    },
    {
      key: 2,
      title: 'Design new UI',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Jane Smith',
      dueDate: '2025-03-05',
    },
    {
      key: 3,
      title: 'Write API documentation',
      status: 'Completed',
      priority: 'Low',
      assignedTo: 'Emily Davis',
      dueDate: '2025-02-20',
    },
    {
      key: 4,
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
      <Sidebar/>
      <Layout>
        <TopHeader/>
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
              flexGrow: 1,
              overflowX: 'auto',
            }}
          >
            <Table
              selections={true}
              rowSelection={{
                type: 'checkbox',
              }}
              rowKey={(record) => record.key}
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
          {new Date().getFullYear()} Yukta
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;

