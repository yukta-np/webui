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
  Modal,
  Form,
  Input,
  Row,
  Col,
} from 'antd';
import Sidebar from '../sidebar/Sidebar';
import TopHeader from '../navbar/TopHeader';
import AddTask from '../popup/AddTask';
const { Content, Footer } = Layout;
const { RangePicker } = DatePicker;
import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

const AllTasks = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [size, setSize] = useState('medium');
  const [open, setOpen] = useState(false);
  const [openResponsive, setOpenResponsive] = useState(false);

  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');
  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [task, setTask] = useState({
    creatorId: 1,
    taskStatus: 1,
    assigneeId: 2,
    title: 'Sample Task',
    description: 'This is a description of the task.',
  });

  const handleEditorChange = (content) => {
    setTask({ ...task, description: content });
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const onSubmit = (values) => {
    console.log('Form Values:', values);
    console.log('SunEditor Content:', task.description);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsModalVisible(false);
    }, 1000);
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
          {/* <AddTask /> */}
          <Button type="primary" onClick={showModal}>
            Add Task
          </Button>
        </div>
        <Space style={{ justifyContent: 'space-between', gap: '24px' }}>
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>Date Range</p>
            <RangePicker style={{ width: 385 }} />
          </Space>
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
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
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
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
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
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
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
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
        <Modal
          title="Task"
          open={isModalVisible}
          onOk={form.submit}
          onCancel={hideModal}
          width={1000}
          confirmLoading={isProcessing}
          style={{ top: 20 }}
        >
          <Form layout={'vertical'} onFinish={onSubmit} form={form}>
            <Row gutter={24}>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={24}>
                    <Form.Item
                      label="Title"
                      name="title"
                      initialValue={task.title}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter the title',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Description"
                      required
                      name="description"
                      tooltip="This is a required field"
                      rules={[
                        { required: true, message: 'Description is required' },
                      ]}
                    >
                      {/* Render SunEditor only on the client-side */}
                      <SunEditor
                        value={task.description}
                        onChange={handleEditorChange}
                        height="250px"
                        setOptions={{
                          buttonList: [
                            [
                              'formatBlock',
                              'bold',
                              'underline',
                              'italic',
                              'strike',
                              'fontColor',
                              'hiliteColor',
                              'list',
                              'table',
                              'link',
                            ],
                            ['fullScreen'],
                          ],
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Row gutter={8}>
                  <Col span={24}>
                    <Form.Item label="Status" name="taskStatus">
                      <Select defaultValue={task.taskStatus}>
                        <Select.Option value={1}>To Do</Select.Option>
                        <Select.Option value={2}>In Progress</Select.Option>
                        <Select.Option value={3}>Completed</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Assign To" name="assigneeId">
                      <Select defaultValue={task.assigneeId}>
                        <Select.Option value={1}>John Doe</Select.Option>
                        <Select.Option value={2}>Jane Doe</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Due Date" name="dueDate">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Optional: File Upload */}
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="File Upload">
                  {/* Add your upload component here if needed */}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </Content>
  );
};
export default AllTasks;
