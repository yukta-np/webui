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
  Tabs,
  Dropdown,
  Menu,
  Grid,
} from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { useBreakpoint } = Grid;
const { Content } = Layout;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';

const AllTasks = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [activeTab, setActiveTab] = useState('write');
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [task] = useState({
    creatorId: 1,
    taskStatus: 1,
    assigneeId: 2,
    title: 'sample task',
    description: '<p>this is a description of the task.</p>',
  });

  const handleEditorChange = (content) => {
    form.setFieldsValue({ description: content });
  };

  const filterSort = (optionA, optionB) => {
    const labelA = String(optionA?.label || '').toLowerCase();
    const labelB = String(optionB?.label || '').toLowerCase();
    return labelA.localeCompare(labelB);
  };

  const editorOptions = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
      ['link', 'image'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print'],
    ],
    minHeight: '200px',
    defaultTag: 'div',
  };

  const PreviewSection = ({ content }) => (
    <div
      className="preview-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
      responsive: ['md'],
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      responsive: ['md'],
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority.localeCompare(b.priority),
      responsive: ['lg'],
    },
    {
      title: 'Assigned',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      responsive: ['md'],
    },
    {
      title: 'Creator',
      dataIndex: 'createdBy',
      key: 'createdBy',
      responsive: ['lg'],
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      responsive: ['sm'],
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) =>
        screens.md ? (
          <Space size="middle">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => console.log(record.key)}
            />
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => console.log(record.key)}
            />
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log(record.key)}
            />
          </Space>
        ) : (
          <Dropdown
            overlay={
              <Menu
                items={[
                  { key: 'view', label: 'View', icon: <EyeOutlined /> },
                  { key: 'edit', label: 'Edit', icon: <EditOutlined /> },
                  {
                    key: 'delete',
                    label: 'Delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        ),
    },
  ];

  const data = [
    {
      key: 1,
      title: 'fix login bug',
      status: 'in progress',
      priority: 'high',
      assignedTo: 'John Doe',
      createdBy: 'John Doe',
      dueDate: '2025-02-28',
    },
    {
      key: 2,
      title: 'design new ui',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Jane Smith',
      createdBy: 'John Doe',
      dueDate: '2025-03-05',
    },
    {
      key: 3,
      title: 'write api documentation',
      status: 'completed',
      priority: 'low',
      assignedTo: 'Emily Davis',
      createdBy: 'John Doe',
      dueDate: '2025-02-20',
    },
    {
      key: 4,
      title: 'implement payment gateway',
      status: 'in progress',
      priority: 'high',
      assignedTo: 'Michael Brown',
      createdBy: 'John Doe',
      dueDate: '2025-03-10',
    },
  ];

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Tasks</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: screens.xs ? 'column' : 'row',
            gap: 16,
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>Tasks</h2>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add Task
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12} lg={6}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <span>Date</span>
              <RangePicker style={{ width: '100%' }} />
            </Space>
          </Col>
          {['creator', 'assignee', 'status', 'archived'].map((filter) => (
            <Col key={filter} xs={24} md={12} lg={6}>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  filterSort={filterSort}
                  options={[
                    { value: '1', label: 'Not identified' },
                    { value: '2', label: 'Closed' },
                    { value: '3', label: 'Communicated' },
                    { value: '4', label: 'Identified' },
                    { value: '5', label: 'Resolved' },
                    { value: '6', label: 'Cancelled' },
                  ]}
                />
              </Space>
            </Col>
          ))}
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
            responsive: true,
          }}
          rowKey="key"
          scroll={{ x: 'max-content' }}
          bordered
          size={screens.xs ? 'small' : 'middle'}
          style={{
            minWidth: screens.xs ? '100%' : 'auto',
            overflowX: 'auto',
          }}
        />

        <Modal
          title="Task Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          width={screens.xs ? '95%' : 1000}
          style={{ top: screens.xs ? 16 : 32 }}
          bodyStyle={{ padding: screens.xs ? 16 : 24 }}
          confirmLoading={isProcessing}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              console.log('Form values:', values);
              setIsProcessing(true);
              setTimeout(() => {
                setIsProcessing(false);
                setIsModalVisible(false);
              }, 1000);
            }}
          >
            <Row gutter={24}>
              <Col xs={24} lg={18}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter a title' }]}
                >
                  <Input placeholder="Enter task title" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: 'Please enter a description' },
                  ]}
                >
                  <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Write" key="write">
                      <SunEditor
                        setOptions={editorOptions}
                        onChange={handleEditorChange}
                        setContents={task.description}
                      />
                    </TabPane>
                    <TabPane tab="Preview" key="preview">
                      <PreviewSection
                        content={form.getFieldValue('description') || ''}
                      />
                    </TabPane>
                  </Tabs>
                </Form.Item>
              </Col>

              <Col xs={24} lg={6}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Status" name="status">
                      <Select defaultValue="to do">
                        <Select.Option value="to do">To Do</Select.Option>
                        <Select.Option value="in progress">
                          In Progress
                        </Select.Option>
                        <Select.Option value="completed">
                          Completed
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Assign to" name="assignee">
                      <Select defaultValue="john doe">
                        <Select.Option value="john doe">John Doe</Select.Option>
                        <Select.Option value="jane smith">
                          Jane Smith
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Due date" name="dueDate">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Category" name="category">
                      <Select defaultValue="general">
                        <Select.Option value="general">General</Select.Option>
                        <Select.Option value="urgent">Urgent</Select.Option>
                        <Select.Option value="low-priority">
                          Low Priority
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Priority" name="priority">
                      <Select defaultValue="medium">
                        <Select.Option value="high">High</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="low">Low</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </Content>
  );
};

export default AllTasks;