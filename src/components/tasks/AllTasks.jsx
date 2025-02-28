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
} from 'antd';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';

const AllTasks = () => {
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
    minHeight: '300px',
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
      title: 'task id',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    {
      title: 'assigned to',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'due date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => console.log(record.key)}>
            view
          </Button>
          <Button type="link" onClick={() => console.log(record.key)}>
            edit
          </Button>
          <Button type="link" danger onClick={() => console.log(record.key)}>
            delete
          </Button>
        </Space>
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
    <Content style={{ margin: '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>home</Breadcrumb.Item>
        <Breadcrumb.Item>tasks</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>tasks</h2>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            add task
          </Button>
        </div>

        <Space wrap style={{ marginBottom: 24, gap: '16px' }}>
          <Space direction="vertical" size={8}>
            <span>date range</span>
            <RangePicker style={{ width: 385 }} />
          </Space>
          {['creator', 'assignee', 'status', 'archived'].map((filter) => (
            <Space key={filter} direction="vertical" size={8}>
              <span>by {filter}</span>
              <Select
                showSearch
                style={{ width: 200 }}
                optionFilterProp="label"
                filterSort={filterSort}
                options={[
                  { value: '1', label: 'not identified' },
                  { value: '2', label: 'closed' },
                  { value: '3', label: 'communicated' },
                  { value: '4', label: 'identified' },
                  { value: '5', label: 'resolved' },
                  { value: '6', label: 'cancelled' },
                ]}
              />
            </Space>
          ))}
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
          }}
          rowKey="key"
        />

        <Modal
          title="task details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          width={1000}
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
              <Col span={18}>
                <Form.Item
                  label="title"
                  name="title"
                  rules={[{ required: true, message: 'please enter a title' }]}
                >
                  <Input placeholder="enter task title" />
                </Form.Item>

                <Form.Item
                  label="description"
                  name="description"
                  rules={[
                    { required: true, message: 'please enter a description' },
                  ]}
                >
                  <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="write" key="write">
                      <SunEditor
                        setOptions={editorOptions}
                        onChange={handleEditorChange}
                        setContents={task.description}
                      />
                    </TabPane>
                    <TabPane tab="preview" key="preview">
                      <PreviewSection
                        content={form.getFieldValue('description') || ''}
                      />
                    </TabPane>
                  </Tabs>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="status" name="status">
                  <Select defaultValue="to do">
                    <Select.Option value="to do">to do</Select.Option>
                    <Select.Option value="in progress">
                      in progress
                    </Select.Option>
                    <Select.Option value="completed">completed</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="assign to" name="assignee">
                  <Select defaultValue="john doe">
                    <Select.Option value="john doe">john doe</Select.Option>
                    <Select.Option value="jane smith">jane smith</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="due date" name="dueDate">
                  <DatePicker style={{ width: '100%' }} />
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
