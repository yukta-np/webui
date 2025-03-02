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
  Tag,
  Mentions,
} from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
  FileImageOutlined,
} from '@ant-design/icons';

import { FaCommentAlt, FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';

import { Upload } from 'antd';
const { Dragger } = Upload;

const { useBreakpoint } = Grid;
const { Content } = Layout;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
import dynamic from 'next/dynamic';
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';
import CommentSection from '@/components/comment/CommentSection';
import { dateRanges } from '@/utils';

const TaskList = ({
  isAllTask = false,
  isMyTask = false,
  isMyTeamTask = false,
}) => {
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
      render: (text) => <a>TSK-{text}</a>,
      width: '5%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      responsive: ['md'],
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
    ...(!isMyTask
      ? [
          {
            title: 'Assigned To',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            responsive: ['md'],
          },
        ]
      : []),

    {
      title: 'Created By',
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
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) =>
        screens.md ? (
          <Space size="middle">
            <Button
              type="link"
              icon={<FaCommentAlt />}
              onClick={showCommentModal}
            />
            {!isMyTask && (
              <>
                <Button
                  type="link"
                  icon={<FaEdit />}
                  onClick={() => console.log(record.key)}
                />
                <Button
                  type="link"
                  danger
                  icon={<RiDeleteBin6Fill />}
                  onClick={() => console.log(record.key)}
                />
              </>
            )}
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
      category: 'bug',
      status: 'in progress',
      priority: 'high',
      assignedTo: 'John Doe',
      createdBy: 'John Doe',
      dueDate: '2025-02-28',
    },
    {
      key: 2,
      title: 'design new ui',
      category: 'bug',

      status: 'pending',
      priority: 'medium',
      assignedTo: 'Jane Smith',
      createdBy: 'John Doe',
      dueDate: '2025-03-05',
    },
    {
      key: 3,
      title: 'write api documentation',
      category: 'bug',

      status: 'completed',
      priority: 'low',
      assignedTo: 'Emily Davis',
      createdBy: 'John Doe',
      dueDate: '2025-02-20',
    },
    {
      key: 4,
      title: 'implement payment gateway',
      category: 'bug',

      status: 'in progress',
      priority: 'high',
      assignedTo: 'Michael Brown',
      createdBy: 'John Doe',
      dueDate: '2025-03-10',
    },
  ];

  //For comments

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'This is a comment about the task.',
      date: '2025-03-01 10:00 AM',
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'I have some updates on this task. Please review.',
      date: '2025-03-02 11:00 AM',
    },
    {
      id: 3,
      author: 'Michael Johnson',
      content: 'I will be working on this task tomorrow.',
      date: '2025-03-03 09:30 AM',
    },
    {
      id: 4,
      author: 'Sarah Williams',
      content: 'This task is progressing well, everything looks good.',
      date: '2025-03-04 01:45 PM',
    },
    {
      id: 5,
      author: 'David Lee',
      content: 'The task is on hold for now due to some blockers.',
      date: '2025-03-05 03:00 PM',
    },
  ]);

  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const [newComment, setNewComment] = useState('');

  const handleNewComment = (comment) => {
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        author: 'Current User',
        content: comment,
        date: new Date().toLocaleString(),
      },
    ]);
    setNewComment('');
  };

  const onCommentChange = (value) => {
    setNewComment(value);
  };

  const showCommentModal = () => {
    setIsCommentModalVisible(true);
  };

  const hideCommentModal = () => {
    setIsCommentModalVisible(false);
  };

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          {isMyTask ? 'My Task' : isAllTask ? 'All Task' : 'My Team Task'}
        </Breadcrumb.Item>
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
          <h2 style={{ margin: 0 }}>
            {isMyTask ? 'My Task' : isAllTask ? 'All Task' : "My Team's Task"}
          </h2>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add Task
          </Button>
        </div>

        <Space style={{ justifyContent: 'space-between', gap: '24px' }}>
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>Date Range</p>
            <RangePicker presets={dateRanges} style={{ width: 385 }} />
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
                <Form.Item>
                  <Dragger>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibited
                      from uploading company data or other banned files.
                    </p>
                  </Dragger>
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
                      <DatePicker
                        presets={dateRanges}
                        style={{ width: '100%' }}
                      />
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

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Uploaded Files" name="files">
                      {/* show uploaded files with attachments icon */}
                      <Space>
                        {form.getFieldValue('files')?.map((file) => (
                          <Tag key={file.uid} closable>
                            <FileImageOutlined />
                            {file.name}
                          </Tag>
                        ))}
                        {!form.getFieldValue('files')?.length && (
                          <Tag>No files uploaded</Tag>
                        )}
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="Task Comments"
          open={isCommentModalVisible}
          onCancel={hideCommentModal}
          footer={null}
          style={{ top: 20 }}
        >
          <div
            style={{
              maxHeight: '500px',
              overflowY: 'auto',
              paddingBottom: '80px',
            }}
          >
            <CommentSection comments={comments} />
          </div>

          {/* Fixed Mention box and Submit Button */}
          <div
            style={{
              bottom: '0',
              width: '100%',
              background: 'white',
              padding: '16px',
            }}
          >
            <Mentions
              value={newComment}
              onChange={onCommentChange}
              placeholder="Add your comment"
              style={{
                width: '100%',
                marginBottom: '8px',
                minHeight: '80px',
              }}
              suggestions={[
                { label: '@John Doe', value: '@John Doe' },
                { label: '@Jane Smith', value: '@Jane Smith' },
                { label: '@Michael Johnson', value: '@Michael Johnson' },
              ]}
            />
            <Button
              type="primary"
              block
              onClick={() => handleNewComment(newComment)}
              disabled={!newComment.trim()}
            >
              Submit Comment
            </Button>
          </div>
        </Modal>
      </div>
    </Content>
  );
};

export default TaskList;
