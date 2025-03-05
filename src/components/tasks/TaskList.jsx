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
  Switch,
  Popconfirm,
} from 'antd';
import {
  EllipsisVertical,
  Pencil,
  Trash2Icon,
  Eye,
  Inbox,
  FileImage,
  MessageSquareText,
  FilePenLine,
} from 'lucide-react';
import { Upload } from 'antd';
import DOMPurify from 'dompurify';
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
import { useTaskStatus } from '@/hooks/useTaskStatus';
import { useTasks } from '@/hooks/useTasks';
import moment from 'moment/moment';
import { constants } from '@/constants';
import axios from 'axios';
import { mutate } from 'swr';

const PreviewSection = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        padding: '16px',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        minHeight: '200px',
      }}
    />
  );
};

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
  const [action, setAction] = useState('add');

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [task] = useState({
    creatorId: 1,
    taskStatus: 1,
    assigneeId: 2,
    title: 'sample task',
    description: '<p>this is a description of the task.</p>',
  });

  const URL = constants.urls.taskUrl;

  const { taskStatus } = useTaskStatus();
  const { tasks: data, revalidate: tasksRevalidate } = useTasks();
  console.log(data);

  const handleEditorChange = (content) => {
    form.setFieldsValue({ description: content });
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onAddClick = () => {
    setAction('add');
    openModal();
  };
  const onEditClick = () => {
    setAction('edit');
    openModal();
  };

  const onViewClick = () => {
    setAction('view');
    openModal();
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsModalVisible(false);
    }, 3000);
    const { files, ...deletedValue } = values;
    const myValues = {
      ...deletedValue,
      createdBy: 1,
      organisationId: 1,
      isArchived: false,
      assignedTo: 2,
    };
    try {
      const response = await axios.post(URL, myValues);
      console.log(response.data);
      tasksRevalidate();
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
      setIsModalVisible(false);
    }
  };

  const getTitle = () => {
    if (action === 'add') {
      return 'Add  Task';
    } else if (action === 'edit') {
      return 'Edit Task';
    }
  };

  const onFileChange = (info) => {
    const newFile = {
      name: info.file.name,
      uid: info.file.uid,
    };

    setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
    form.setFieldsValue({ files: [...uploadedFiles, newFile] });
  };

  const onFileRemove = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    form.setFieldsValue({ files: updatedFiles });

    console.log('Files after removal:', updatedFiles);
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
      responsive: ['md'],
      render: (text) => (
        <a className="text-blue-600" onClick={onViewClick}>
          TSK-{text}
        </a>
      ),
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
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 200 }}
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={taskStatus?.map((ts) => ({
            label: ts.name,
            value: ts.id,
          }))}
          onChange={(value) => onColumnStatusChange(value, record)}
        />
      ),
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
      render: (text) => moment(text).format('DD/MM/YYYY '),
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
              icon={<MessageSquareText />}
              onClick={showCommentModal}
            />
            {!isMyTask && (
              <>
                <Button
                  type="link"
                  icon={<FilePenLine />}
                  onClick={onEditClick}
                />

                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    danger
                    icon={<Trash2Icon stroke="red" />}
                  />
                </Popconfirm>
              </>
            )}
          </Space>
        ) : (
          <Dropdown
            overlay={
              <Menu
                items={[
                  { key: 'view', label: 'View', icon: <Eye /> },
                  { key: 'edit', label: 'Edit', icon: <Pencil /> },
                  {
                    key: 'delete',
                    label: 'Delete',
                    icon: <Trash2Icon />,
                    danger: true,
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <Button icon={<EllipsisVertical />} />
          </Dropdown>
        ),
    },
  ];

  const onColumnStatusChange = (value, record) => {
    const updatedTask = { ...record, status: value };
    updateTaskStatus(updatedTask);
  };

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
          <p className="text-xl font-bold">
            {isMyTask ? 'My Task' : isAllTask ? 'All Task' : "My Team's Task"}
          </p>
          <Button type="primary" onClick={onAddClick}>
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
              style={{ width: 200 }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={[
                { value: '1', label: 'John Doe' },
                { value: '2', label: 'Jane Smith' },
                { value: '3', label: 'Michael Johnson' },
              ]}
            />
          </Space>
          {!isMyTask && (
            <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
              <p>By Assignee</p>
              <Select
                showSearch
                style={{ width: 200 }}
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={[
                  { value: '1', label: 'John Doe' },
                  { value: '2', label: 'Jane Smith' },
                  { value: '3', label: 'Michael Johnson' },
                ]}
              />
            </Space>
          )}

          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>By Status </p>
            <Select
              showSearch
              style={{ width: 200 }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={taskStatus?.map((ts) => ({
                label: ts.name,
                value: ts.name,
              }))}
            />
          </Space>
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>Archived </p>
            <Select
              showSearch
              style={{ width: 150 }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={[
                { value: '1', label: 'No' },
                { value: '2', label: 'Yes' },
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
          title={getTitle()}
          open={isModalVisible}
          onCancel={closeModal}
          footer={
            action === 'add' ? (
              <>
                <Button type="primary" onClick={() => form.submit()}>
                  Submit
                </Button>
                <Button onClick={closeModal}>Cancel</Button>
              </>
            ) : action === 'edit' ? (
              <Button type="primary" onClick={() => form.submit()}>
                Update
              </Button>
            ) : (
              []
            )
          }
          width={screens.xs ? '95%' : 1000}
          style={{ top: screens.xs ? 16 : 32 }}
          bodyStyle={{ padding: screens.xs ? 16 : 24 }}
          confirmLoading={isProcessing}
        >
          <Form
            form={form}
            layout="vertical"
            // onFinish={(values) => {
            //   console.log('Form values:', values);
            //   setIsProcessing(true);
            //   setTimeout(() => {
            //     setIsProcessing(false);
            //     setIsModalVisible(false);
            //   }, 1000);
            // }}
            onFinish={onSubmit}
            initialValues={{
              status: '',
              assignedTo: '',
              dueDate: null,
              category: '',
              priority: '',
              files: [],
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
                  <Dragger
                    name="files"
                    multiple
                    beforeUpload={() => false}
                    onChange={onFileChange}
                    showUploadList={false}
                  >
                    <p className="ant-upload-drag-icon">
                      <Inbox />
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
                      <Select
                        defaultValue=""
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={taskStatus?.map((ts) => ({
                          label: ts.name,
                          value: ts.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={24}>
                    <Form.Item
                      label={isMyTask ? 'Assign yourself' : 'Assign to'}
                      name="assignedTo"
                    >
                      {isMyTask ? (
                        <Switch disabled defaultChecked />
                      ) : (
                        <Select defaultValue="john doe">
                          <Select.Option value="john doe">
                            John Doe
                          </Select.Option>
                          <Select.Option value="jane smith">
                            Jane Smith
                          </Select.Option>
                        </Select>
                      )}
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
                      <Select defaultValue="">
                        <Select.Option value="incident">Incident</Select.Option>
                        <Select.Option value="complaint">
                          Complaint
                        </Select.Option>
                        <Select.Option value="request">Request</Select.Option>
                        <Select.Option value="problem">Problem</Select.Option>
                        <Select.Option value="change">Change</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Priority" name="priority">
                      <Select defaultValue="">
                        <Select.Option value="critical">Critical</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="low">Low</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item label="Uploaded Files" name="files">
                      <Space>
                        {uploadedFiles.length > 0 ? (
                          uploadedFiles.map((file, index) => (
                            <Tag
                              key={file.uid || index}
                              closable
                              onClose={() => onFileRemove(index)}
                            >
                              <FileImage />
                              {file.name || 'File'}
                            </Tag>
                          ))
                        ) : (
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

          <div
            style={{
              position: 'sticky',
              bottom: '0',
              width: '100%',
              background: 'white',
              padding: '16px',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
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
