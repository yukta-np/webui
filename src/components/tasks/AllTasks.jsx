import React, { useState } from 'react';
import {
  Breadcrumb,
  Layout,
  Table,
  theme,
  Button,
  Space,
  DatePicker,
  Select,
} from 'antd';
import Sidebar from '../sidebar/Sidebar';
import TopHeader from '../NavBar/TopHeader';
const { Content, Footer } = Layout;
const { RangePicker } = DatePicker;

const AllTasks = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [size, setSize] = useState('medium');
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
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
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a href="javascript:;" onClick={() => console.log(record.key)}>
            View
          </a>
          <a href="javascript:;" onClick={() => console.log(record.key)}>
            Edit
          </a>
          <a href="javascript:;" onClick={() => console.log(record.key)}>
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: 1,
      title: 'Fix login bug',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'John Doe',
      createdBy: 'John Doe',
      dueDate: '2025-02-28',
    },
    {
      key: 2,
      title: 'Design new UI',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Jane Smith',
      createdBy: 'John Doe',
      dueDate: '2025-03-05',
    },
    {
      key: 3,
      title: 'Write API documentation',
      status: 'Completed',
      priority: 'Low',
      assignedTo: 'Emily Davis',
      createdBy: 'John Doe',
      dueDate: '2025-02-20',
    },
    {
      key: 4,
      title: 'Implement payment gateway',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Michael Brown',
      createdBy: 'John Doe',

      dueDate: '2025-03-10',
    },
  ];
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sidebar />
      <Layout>
        <TopHeader />
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
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Tasks</Breadcrumb.Item>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <p style={{ fontSize: '25px', margin: 0 }}>Tasks</p>
              <Button type="primary" size={size}>
                Add Task
              </Button>
            </div>
            <Space style={{ justifyContent: 'space-between', gap: '24px' }}>
              <Space
                direction="vertical"
                size={12}
                style={{ marginBottom: 16 }}
              >
                <p>Date Range</p>
                <RangePicker style={{ width: 385 }} />
              </Space>
              <Space
                direction="vertical"
                size={12}
                style={{ marginBottom: 16 }}
              >
                <p>By Creator </p>
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={[
                    {
                      value: '1',
                      label: 'Not Identified',
                    },
                    {
                      value: '2',
                      label: 'Closed',
                    },
                    {
                      value: '3',
                      label: 'Communicated',
                    },
                    {
                      value: '4',
                      label: 'Identified',
                    },
                    {
                      value: '5',
                      label: 'Resolved',
                    },
                    {
                      value: '6',
                      label: 'Cancelled',
                    },
                    {
                      value: '7',
                      label: 'Duplicate',
                    },
                    {
                      value: '8',
                      label: 'Invalid',
                    },
                    {
                      value: '9',
                      label: "Won't Fix",
                    },
                  ]}
                />
              </Space>
              <Space
                direction="vertical"
                size={12}
                style={{ marginBottom: 16 }}
              >
                <p>By Assignee</p>
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={[
                    {
                      value: '1',
                      label: 'Not Identified',
                    },
                    {
                      value: '2',
                      label: 'Closed',
                    },
                    {
                      value: '3',
                      label: 'Communicated',
                    },
                    {
                      value: '4',
                      label: 'Identified',
                    },
                    {
                      value: '5',
                      label: 'Resolved',
                    },
                    {
                      value: '6',
                      label: 'Cancelled',
                    },
                    {
                      value: '7',
                      label: 'Duplicate',
                    },
                    {
                      value: '8',
                      label: 'Invalid',
                    },
                    {
                      value: '9',
                      label: "Won't Fix",
                    },
                  ]}
                />
              </Space>
              <Space
                direction="vertical"
                size={12}
                style={{ marginBottom: 16 }}
              >
                <p>By Status </p>
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={[
                    {
                      value: '1',
                      label: 'Not Identified',
                    },
                    {
                      value: '2',
                      label: 'Closed',
                    },
                    {
                      value: '3',
                      label: 'Communicated',
                    },
                    {
                      value: '4',
                      label: 'Identified',
                    },
                    {
                      value: '5',
                      label: 'Resolved',
                    },
                    {
                      value: '6',
                      label: 'Cancelled',
                    },
                    {
                      value: '7',
                      label: 'Duplicate',
                    },
                    {
                      value: '8',
                      label: 'Invalid',
                    },
                    {
                      value: '9',
                      label: "Won't Fix",
                    },
                  ]}
                />
              </Space>
              <Space
                direction="vertical"
                size={12}
                style={{ marginBottom: 16 }}
              >
                <p>Archived </p>
                <Select
                  showSearch
                  style={{
                    width: 150,
                  }}
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={[
                    {
                      value: '1',
                      label: 'Not Identified',
                    },
                    {
                      value: '2',
                      label: 'Closed',
                    },
                    {
                      value: '3',
                      label: 'Communicated',
                    },
                    {
                      value: '4',
                      label: 'Identified',
                    },
                    {
                      value: '5',
                      label: 'Resolved',
                    },
                    {
                      value: '6',
                      label: 'Cancelled',
                    },
                    {
                      value: '7',
                      label: 'Duplicate',
                    },
                    {
                      value: '8',
                      label: 'Invalid',
                    },
                    {
                      value: '9',
                      label: "Won't Fix",
                    },
                  ]}
                />
              </Space>
            </Space>
            <Table
              rowSelection={{
                type: 'checkbox',
              }}
              rowKey={(record) => record.key}
              columns={columns}
              dataSource={data}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: onShowSizeChange,
              }}
            />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          {new Date().getFullYear()} ©Yukta
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AllTasks;
