import React, { useState, useEffect } from 'react';
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
  Divider,
  Avatar,
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
import { dateRanges, openNotification } from '@/utils';
import { useTaskStatus } from '@/hooks/useTaskStatus';
import { useTaskPriority } from '@/hooks/useTaskPriority';
import { useTaskCategory } from '@/hooks/useTaskCategory';
import { useTasks } from '@/hooks/useTasks';
import { useUsers } from '@/hooks/useUsers';
import moment from 'moment/moment';
import {
  createTask,
  updateTask,
  deleteTask,
  createComment,
  getComments,
} from '@/services/tasks.http';
import {
  FileImageOutlined,
  FilePdfOutlined,
  VideoCameraOutlined, // ✅ Use this for videos
  FileTextOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useAppContext } from '@/app-context';

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase(); // Get file extension

  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return (
        <FileImageOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
      ); // Blue for images
    case 'pdf':
      return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />; // Red for PDFs
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
      return (
        <VideoCameraOutlined style={{ color: '#faad14', fontSize: '18px' }} />
      ); // ✅ Yellow for videos
    case 'txt':
    case 'doc':
    case 'docx':
      return (
        <FileTextOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
      ); // Green for text files
    default:
      return <FileOutlined style={{ color: '#8c8c8c', fontSize: '18px' }} />; // Default for other files
  }
};

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
  const [editingData, setEditingData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const [assignedTo, setAssignedTo] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [editorContent, setEditorContent] = useState();

  const { loggedInUser } = useAppContext();

  let params = {};

  if (status) {
    params.status = status;
  }

  if (createdBy) {
    params.createdBy = createdBy;
  }

  if (assignedTo) {
    params.assignedTo = assignedTo;
  }

  const {
    taskList: tasks,
    revalidate: tasksRevalidate,
    meta: taskMeta,
  } = useTasks(params);
  const { taskStatus } = useTaskStatus();
  const { taskCategory } = useTaskCategory();
  const { taskPriority } = useTaskPriority();
  const { users } = useUsers();

  const handleEditorChange = (content) => {
    setEditorContent(content);
    form.setFieldsValue({ description: content });
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onAddClick = () => {
    setAction('add');
    openModal();
  };
  const onEditClick = (record) => {
    const newRecord = {
      ...record,
      dueDate: record.dueDate ? moment(record.dueDate) : null,
    };
    setEditingData(newRecord);
    form.setFieldsValue(newRecord);
    setAction('edit');
    openModal();
  };

  const onDeleteClick = (record) => {
    deleteTask(record.id);
    tasksRevalidate();
  };

  const onViewClick = (tasks) => {
    const newRecord = {
      title: tasks?.title,
      description: tasks?.description,
      status: tasks?.status,
      priority: tasks?.priority,
      category: tasks?.category,
      assignedTo: tasks?.assignee?.fullName,
      dueDate: tasks?.dueDate ? moment(tasks?.dueDate) : null,
    };
    setAction('view');
    form.setFieldsValue(newRecord);

    openModal();
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);
    const { files, ...deletedValue } = values;
    const myValues = {
      ...deletedValue,
      dueDate: new Date(values?.dueDate),
      createdBy: loggedInUser?.userId,
      organisationId: loggedInUser?.orgId,
      isArchived: false,
      taskItems: [],
      taskUsers: [],
    };
    try {
      if (action === 'edit') {
        await updateTask(editingData.id, values);
        openNotification('Task updated successfully');
      } else {
        await createTask(myValues);
        openNotification('Task added successfully');
      }
      tasksRevalidate();
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
      setIsModalVisible(false);
    }
  };

  const onColumnStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
      openNotification('Task status updated successfully');
      tasksRevalidate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filterByDateRange = (value) => {
    const startDate = value[0];
    const endDate = value[1];
    const formattedStartDate = startDate
      ? startDate.format('YYYY-MM-DD')
      : null;
    const formattedEndDate = endDate ? endDate.format('YYYY-MM-DD') : null;
    params = {
      ...params,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    tasksRevalidate();
  };

  const filterByStatus = (value) => {
    setStatus(value);
    tasksRevalidate();
  };

  const filterByCreator = (value) => {
    setCreatedBy(value);
    tasksRevalidate();
  };

  const filterByAssignee = (value) => {
    setAssignedTo(value);
    tasksRevalidate();
  };

  const getTitle = () => {
    if (action === 'add') {
      return 'Add  Task';
    } else if (action === 'edit') {
      return 'Edit Task';
    } else if (action === 'view') {
      return 'Task';
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
      render: (_, tasks) => (
        <a className="text-blue-600" onClick={() => onViewClick(tasks)}>
          {tasks?.displayId}
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
      width: 150,

      render: (text, tasks) => (
        <>
          {isMyTask ? (
            <Select
              defaultValue={text}
              style={{ width: 150 }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={taskStatus?.map((ts) => ({
                label: ts.name.toUpperCase(),
                value: ts.name,
              }))}
              onChange={(value) => onColumnStatusChange(tasks.id, value)}
            />
          ) : (
            <Tag
              className="items-center"
              color={
                text === 'Completed'
                  ? 'green'
                  : text === 'In Progress'
                  ? 'orange'
                  : 'blue'
              }
            >
              {text.toUpperCase()}
            </Tag>
          )}
        </>
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
            render: (_, tasks) => tasks?.assignee.fullName,
          },
        ]
      : []),
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      responsive: ['lg'],
      render: (_, tasks) => tasks?.creator.fullName,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      responsive: ['sm'],
      render: (text) => moment(text).format('DD/MM/YYYY'),
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
              icon={<MessageSquareText size={18} />}
              onClick={() => showCommentModal(record)}
            />
            {!isMyTask && (
              <>
                <Button
                  type="link"
                  icon={<FilePenLine size={18} />}
                  onClick={() => onEditClick(record)}
                />
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onDeleteClick(record)}
                >
                  <Button
                    type="link"
                    danger
                    icon={<Trash2Icon stroke="red" size={18} />}
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

  const [comments, setComments] = useState([]);

  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  const onCommentSubmit = async (comments) => {
    const comment = {
      comment: comments,
    };
    // setComments([
    //   ...comments,
    //   {
    //     id: comments.length + 1,
    //     author: 'Current User',
    //     content: comment,
    //     date: new Date().toLocaleString(),
    //   },
    // ]);
    try {
      await createComment(taskId, comment);
    } catch (error) {
      console.log(error);
    }
  };

  const onCommentChange = (value) => {
    setNewComment(value);
  };

  const showCommentModal = async (record) => {
    const response = await getComments(record.id);
    const data = response.data;
    setComments(data);
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
              allowClear={true}
              optionLabelProp="label"
              showSearch
              style={{ width: 200 }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              onChange={(values) => filterByCreator(values)}
            >
              {users?.map((u) => (
                <Option key={u.id} value={`${u.id} `} label={`${u.fullName} `}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar src={u.avatar} style={{ marginRight: 8 }}>
                      {!u.avatar && `${u.firstName[0]}`}{' '}
                    </Avatar>
                    <span>{`${u.fullName} `}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Space>
          {!isMyTask && (
            <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
              <p>By Assignee</p>
              <Select
                allowClear={true}
                optionLabelProp="label"
                showSearch
                style={{ width: 200 }}
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                onChange={(values) => filterByAssignee(values)}
              >
                {users?.map((u) => (
                  <Option
                    key={u.id}
                    value={`${u.id} `}
                    label={`${u.fullName} `}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar src={u.avatar} style={{ marginRight: 8 }}>
                        {!u.avatar && `${u.firstName[0]}`}{' '}
                      </Avatar>
                      <span>{`${u.fullName} `}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Space>
          )}

          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>By Status </p>
            <Select
              showSearch
              style={{ width: 200 }}
              allowClear={true}
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
              onChange={(value) => filterByStatus(value)}
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
          dataSource={tasks}
          pagination={{
            ...taskMeta,
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
            responsive: true,
          }}
          rowKey={(record) => record.id}
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
                <Divider />
                <Button className="mr-2" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Add
                </Button>
              </>
            ) : action === 'edit' ? (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Update
                </Button>
              </>
            ) : (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
              </>
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
            onFinish={onSubmit}
            disabled={action === 'view'}
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
                  {action === 'view' ? (
                    <PreviewSection
                      content={form.getFieldValue('description')}
                    />
                  ) : (
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                      <TabPane tab="Write" key="write">
                        <SunEditor
                          setOptions={editorOptions}
                          onChange={handleEditorChange}
                          placeholder="Enter your task description"
                          setContents={
                            action === 'edit' || action === 'view'
                              ? form.getFieldValue('description')
                              : tasks?.description
                          }
                        />
                      </TabPane>
                      <TabPane tab="Preview" key="preview">
                        <PreviewSection content={editorContent} />
                      </TabPane>
                    </Tabs>
                  )}
                </Form.Item>
                <Form.Item>
                  <Dragger
                    name="files"
                    multiple
                    beforeUpload={() => false}
                    onChange={onFileChange}
                    showUploadList={false}
                  >
                    <div className="flex items-center justify-center">
                      <Inbox
                        size={80}
                        strokeWidth={1}
                        className="text-gray-300 mr-2"
                      />{' '}
                    </div>
                    <p className="ant-upload-text !text-gray-500">
                      Click or drag file to this area to upload
                    </p>
                  </Dragger>
                </Form.Item>
              </Col>

              <Col xs={24} lg={6}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={24}>
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[
                        { required: true, message: 'Please select a status' },
                      ]}
                    >
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
                      rules={[
                        { required: true, message: 'Please select a user' },
                      ]}
                    >
                      {isMyTask ? (
                        <Switch disabled defaultChecked />
                      ) : (
                        <Select optionLabelProp="label">
                          {users?.map((u) => (
                            <Option
                              key={u.id}
                              value={u.id}
                              label={`${u.fullName}`}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Avatar
                                  src={u.avatar}
                                  style={{ marginRight: 8 }}
                                >
                                  {!u.avatar && `${u.firstName[0]}`}{' '}
                                </Avatar>
                                <span>{`${u.fullName} `}</span>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item
                      label="Due date"
                      name="dueDate"
                      rules={[
                        { required: true, message: 'Please select a due date' },
                      ]}
                    >
                      <DatePicker
                        presets={dateRanges}
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item
                      label="Category"
                      name="category"
                      rules={[
                        { required: true, message: 'Please select a category' },
                      ]}
                    >
                      <Select
                        defaultValue=""
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={taskCategory?.map((tc) => ({
                          label: tc.name,
                          value: tc.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} lg={24}>
                    <Form.Item
                      label="Priority"
                      name="priority"
                      rules={[
                        { required: true, message: 'Please select a priority' },
                      ]}
                    >
                      <Select
                        defaultValue=""
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={taskPriority?.map((tp) => ({
                          label: tp.name,
                          value: tp.name,
                        }))}
                      />
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
                              {getFileIcon(file.name)} {file.name || 'File'}
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
          on
          footer={null}
          style={{ top: 20 }}
        >
          <Divider />
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
              options={users?.map((u) => ({
                label: (
                  <Space>
                    <Avatar src={u.avatar} style={{ marginRight: 8 }}>
                      {!u.avatar && `${u.firstName[0]}`}{' '}
                    </Avatar>
                    <span>{u.fullName}</span>
                  </Space>
                ),
                value: `${u.fullName}`,
              }))}
            />
            <Button
              type="primary"
              block
              onClick={onCommentSubmit}
              disabled={!newComment.trim()}
            >
              Comment
            </Button>
          </div>
        </Modal>
      </div>
    </Content>
  );
};

export default TaskList;
