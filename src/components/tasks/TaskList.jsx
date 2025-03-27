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
  Checkbox,
  Popover,
  Tooltip,
  Empty,
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
  FileText,
  File,
  ListTree,
  Archive,
  ArchiveRestore,
  X,
  ChevronRight,
  ChevronDown,
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
import { dateRanges, objectHasValue, openNotification } from '@/utils';
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
import { useAppContext } from '@/app-context';
import { Actions } from '@/constants';

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();

  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <FileImage style={{ color: '#1890ff', fontSize: '18px' }} />;
    case 'pdf':
      return <FileText style={{ color: '#ff4d4f', fontSize: '18px' }} />;

    case 'txt':
      return <FileText style={{ color: '#52c41a', fontSize: '18px' }} />;
    default:
      return <File style={{ color: '#8c8c8c', fontSize: '18px' }} />; // Default for other files
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
  const [action, setAction] = useState(Actions.add);
  const [editingData, setEditingData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const [assignedTo, setAssignedTo] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tablePage, setTablePage] = useState({});
  const [archived, setArchived] = useState(false);
  const [editorContent, setEditorContent] = useState();
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [createAnother, setCreateAnother] = useState(false);
  const [isTaskLinkModalVisible, setIsTaskLinkModalVisible] = useState(false);
  const [linkedTasks, setLinkedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLinkedTasksExpanded, setIsLinkedTasksExpanded] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);

  const { loggedInUser } = useAppContext();

  let params = {};

  if (status) {
    params.status = status;
  }

  if (objectHasValue(tablePage)) {
    params.limit = tablePage.limit;
    params.offset = tablePage.offset;
    if (tablePage.sort) {
      params.sort = tablePage.sort;
    }
  }

  if (createdBy) {
    params.createdBy = createdBy;
  }

  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  if (assignedTo) {
    params.assignedTo = assignedTo;
  }
  if (archived) {
    params.isArchived = archived;
  }

  if (isMyTask) {
    params.assignedTo = loggedInUser?.userId;
  }

  if (isMyTeamTask) {
    params.createdBy = loggedInUser?.userId;
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
    setEditorContent('');
    setIsModalVisible(false);
  };

  const openTaskLinkModal = () => {
    setIsTaskLinkModalVisible(true);
  };

  const closeTaskLinkModal = () => {
    setIsTaskLinkModalVisible(false);
  };

  const toggleTaskSelection = (task) => {
    if (task.id === editingData?.id) return;
    setLinkedTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists
        ? prev.filter((t) => t.id !== task.id)
        : [...prev, { ...task, parentId: editingData?.id }];
    });

    closeTaskLinkModal();
  };
  console.log('haha', linkedTasks);

  const onAddClick = () => {
    setAction(Actions.add);
    setEditorContent('');
    openModal();
  };

  const onToggleArchiveClick = async (ids = []) => {
    if (!ids?.length || !tasks?.length) {
      openNotification('Please select at least one task', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const firstSelectedTask = tasks.find((t) => t.id === ids[0]);
      if (!firstSelectedTask) {
        openNotification('Selected task not found', 'error');
        return;
      }

      const newArchiveStatus = !firstSelectedTask.isArchived;

      await Promise.all(
        ids.map((id) => updateTask(id, { isArchived: newArchiveStatus }))
      );

      tasksRevalidate();

      setSelectedTaskId([]);

      openNotification(
        `${newArchiveStatus ? 'Archived' : 'Unarchived'} ${
          ids.length
        } task(s) successfully`
      );
    } catch (error) {
      console.error('Error toggling archive status:', error);
      openNotification('Failed to update tasks', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const onCreateAnotherChange = (e) => {
    setCreateAnother(e.target.checked);
  };
  const onEditClick = (record) => {
    const newRecord = {
      ...record,
      dueDate: record.dueDate ? moment(record.dueDate) : null,
    };
    setEditingData(newRecord);
    form.setFieldsValue(newRecord);
    setEditorContent(record.description);
    setAction(Actions.edit);
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
    setAction(Actions.view);
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
      parentId: editingData?.parentId || null,
    };

    console.log('values', myValues);

    try {
      const response =
        Actions.edit === action
          ? await updateTask(editingData?.id, myValues)
          : await createTask(myValues);

      if (linkedTasks.length > 0 && Actions.edit == action) {
        await Promise.all(
          linkedTasks.map((task) => {
            if (task.id === editingData?.id) return Promise.resolve();

            return updateTask(task.id, { parentId: editingData?.id, ...task });
          })
        );
      }
      openNotification(`Task ${action}ed successfully`);
      tasksRevalidate();
      if (createAnother) {
        openModal();
        form.resetFields();
        setEditorContent('');
        setUploadedFiles([]);
      } else {
        closeModal();
      }
      setLinkedTasks([]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
      form.resetFields();
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

  const onTableChange = (pagination, filters, sorter) => {
    const options = {
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      sort: sorter.order === 'descend' ? `-${sorter.field}` : sorter.field,
      ...filters,
    };
    setTablePage(options);
  };

  const filterByDateRange = (value) => {
    if (!value) {
      setStartDate(null);
      setEndDate(null);
      tasksRevalidate();
      return;
    }
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
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
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

  const filterByArchived = (value) => {
    setArchived(value);
    tasksRevalidate();
  };

  const getTitle = () => {
    if (Actions.add === action) {
      return 'Add  Task';
    } else if (Actions.edit === action) {
      return 'Edit Task';
    } else if (Actions.view === action) {
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
  const groupTasksByParent = (tasks = []) => {
    const taskMap = {};
    const parentTasks = [];

    // Create a map of all tasks and initialize children
    tasks.forEach((task) => {
      taskMap[task.id] = {
        ...task,
        children: task.subTasks || [], // Use existing subTasks array
        depth: 0,
      };
    });

    // Build hierarchy
    tasks.forEach((task) => {
      if (task.parentId && taskMap[task.parentId]) {
        if (!taskMap[task.parentId].children) {
          taskMap[task.parentId].children = [];
        }
        // Only add if not already present (prevents duplicates)
        if (!taskMap[task.parentId].children.some((t) => t.id === task.id)) {
          taskMap[task.parentId].children.push(taskMap[task.id]);
        }
      } else if (!task.parentId) {
        parentTasks.push(taskMap[task.id]);
      }
    });

    // Calculate depths
    const calculateDepth = (task, depth = 0) => {
      task.depth = depth;
      if (task.children && task.children.length) {
        task.children.forEach((child) => calculateDepth(child, depth + 1));
      }
    };

    parentTasks.forEach((task) => calculateDepth(task));

    return parentTasks;
  };

  const groupedTasks = groupTasksByParent(tasks || []);

  console.log(groupedTasks);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
      responsive: ['md'],
      render: (_, task) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: `${(task.depth || 0) * 16}px`,
            minHeight: '32px',
          }}
        >
          {task.children?.length > 0 ? (
            <Button
              type="text"
              size="small"
              icon={
                expandedRows.includes(task.id) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                if (expandedRows.includes(task.id)) {
                  setExpandedRows(expandedRows.filter((id) => id !== task.id));
                } else {
                  setExpandedRows([...expandedRows, task.id]);
                }
              }}
              style={{
                marginRight: 8,
                width: 24,
                height: 24,
                minWidth: 24,
              }}
            />
          ) : (
            <div style={{ width: 24, marginRight: 8 }}></div> // Empty spacer for alignment
          )}
          <a
            className="text-blue-600"
            onClick={() => onViewClick(task)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {task?.displayId}
          </a>
        </div>
      ),
      width: 120, // Slightly wider to accommodate the arrow
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {text}
        </div>
      ),
      width: 200,
    },

    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      responsive: ['md'],
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      responsive: ['md'],
      width: 100,

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
                label: ts?.name.toUpperCase(),
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
      width: 100,
    },
    ...(!isMyTask
      ? [
          {
            title: 'Assigned To',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            responsive: ['md'],
            render: (_, tasks) => tasks?.assignee?.fullName,
            width: 150,
          },
        ]
      : []),

    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      responsive: ['sm'],
      render: (text) => moment(text).format('DD/MM/YYYY'),
      width: 100,
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

  const showCommentModal = async (record) => {
    setCurrentTaskId(record.id);
    const response = await getComments(record.id);
    const data = response.data;
    setComments(data);
    setIsCommentModalVisible(true);
  };

  const onCommentSubmit = async (newComment) => {
    setIsProcessing(true);
    const comment = {
      comment: newComment,
    };
    try {
      await createComment(currentTaskId, comment);
      const response = await getComments(currentTaskId);
      setComments(response.data);
      setNewComment('');
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
      form.resetFields();
    }
  };

  const onCommentChange = (value) => {
    setNewComment(value);
  };

  const hideCommentModal = () => {
    setIsCommentModalVisible(false);
    form.resetFields();
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
          {selectedTaskId?.length > 0 ? (
            <Popconfirm
              placement="topLeft"
              title={`${
                selectedTaskId.some((id) => {
                  const task = tasks?.find((t) => t.id === id);
                  return task?.isArchived;
                })
                  ? 'Unarchive'
                  : 'Archive'
              } ${selectedTaskId.length} selected task(s)?`}
              onConfirm={() => onToggleArchiveClick(selectedTaskId)}
              okText="Yes"
              cancelText="No"
              disabled={selectedTaskId.length === 0}
            >
              <Button
                type="primary"
                loading={isProcessing}
                disabled={selectedTaskId.length === 0}
                icon={
                  selectedTaskId.some((id) => {
                    const task = tasks?.find((t) => t.id === id);
                    return task?.isArchived;
                  }) ? (
                    <ArchiveRestore className="mt-1" size={16} />
                  ) : (
                    <Archive className="mt-1" size={16} />
                  )
                }
              >
                {selectedTaskId.length === 0
                  ? 'Select tasks to archive'
                  : selectedTaskId.some((id) => {
                      const task = tasks?.find((t) => t.id === id);
                      return task?.isArchived;
                    })
                  ? 'Unarchive'
                  : 'Archive'}
              </Button>
            </Popconfirm>
          ) : (
            <Button type="primary" onClick={onAddClick}>
              Add Task
            </Button>
          )}
        </div>

        <Space style={{ justifyContent: 'space-between', gap: '24px' }}>
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>Date Range</p>
            <RangePicker
              presets={dateRanges}
              style={{ width: 385 }}
              onChange={(value) => filterByDateRange(value)}
            />
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
                <Option
                  key={u?.id}
                  value={`${u?.id} `}
                  label={`${u?.fullName} `}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar src={u?.avatar} style={{ marginRight: 8 }}>
                      {!u?.avatar && `${u?.firstName[0]}`}{' '}
                    </Avatar>
                    <span>{`${u?.fullName} `}</span>
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
                    key={u?.id}
                    value={`${u?.id} `}
                    label={`${u?.fullName} `}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar src={u?.avatar} style={{ marginRight: 8 }}>
                        {!u?.avatar && `${u?.firstName[0]}`}{' '}
                      </Avatar>
                      <span>{`${u?.fullName} `}</span>
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
                label: ts?.name,
                value: ts?.name,
              }))}
              onChange={(value) => filterByStatus(value)}
            />
          </Space>
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>Archived </p>
            <Select
              showSearch
              allowClear
              style={{ width: 150 }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={[
                { value: 'false', label: 'No' },
                { value: 'true', label: 'Yes' },
              ]}
              onChange={(value) => filterByArchived(value)}
            />
          </Space>
        </Space>

        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedTaskId,
            onChange: (selectedRowKeys) => setSelectedTaskId(selectedRowKeys),
          }}
          columns={columns}
          dataSource={groupedTasks}
          pagination={{
            total: taskMeta?.totalRows,
            pageSize: taskMeta?.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            responsive: true,
          }}
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content' }}
          bordered
          size="small"
          style={{
            minWidth: screens.xs ? '100%' : 'auto',
            overflowX: 'auto',
          }}
          onChange={onTableChange}
          expandable={{
            childrenColumnName: 'children',
            defaultExpandAllRows: false,
            expandedRowKeys: expandedRows,
            expandIcon: () => null,
            rowExpandable: (record) => record.children?.length > 0,
          }}
        />

        <Modal
          title={getTitle()}
          open={isModalVisible}
          onCancel={closeModal}
          footer={
            Actions.add === action ? (
              <>
                <Divider />
                <Checkbox onChange={onCreateAnotherChange} className="mr-2 ">
                  Create another
                </Checkbox>
                <Button className="mr-2" onClick={closeModal}>
                  Cancel
                </Button>

                <Button type="primary" onClick={() => form.submit()}>
                  Add
                </Button>
              </>
            ) : Actions.edit === action ? (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Update
                </Button>
                <Tooltip
                  title={
                    editingData?.parentId
                      ? 'Subtasks cannot have their own subtasks'
                      : ''
                  }
                >
                  <Button
                    type="default"
                    className="left-4 float-left"
                    onClick={openTaskLinkModal}
                    icon={
                      <ListTree className="mt-1" stroke="#1890ff" size={18} />
                    }
                    disabled={editingData?.parentId !== null}
                  >
                    Add Subtask
                  </Button>
                </Tooltip>
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
            disabled={Actions.view === action}
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
                  {Actions.view === action ? (
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
                            action === Actions.edit
                              ? editingData?.description
                              : editorContent
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
                        className="mr-2 text-gray-300"
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
                          label: ts?.name,
                          value: ts?.name,
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
                        <Select
                          showSearch
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            option?.label
                              ?.toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          optionLabelProp="label"
                        >
                          {users?.map((u) => (
                            <Option
                              key={u?.id}
                              value={u?.id}
                              label={`${u?.fullName}`}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Avatar
                                  src={u?.avatar}
                                  style={{ marginRight: 8 }}
                                >
                                  {u?.fullName
                                    ?.split(' ')
                                    .map((name) => name[0].toUpperCase())
                                    .join('')}
                                </Avatar>
                                <span>{`${u?.fullName} `}</span>
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
                          label: tc?.name,
                          value: tc?.name,
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
                          label: tp?.name,
                          value: tp?.name,
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
          {linkedTasks.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: 8,
                }}
                onClick={() => setIsLinkedTasksExpanded(!isLinkedTasksExpanded)}
              >
                <span className="ml-2 ">
                  {isLinkedTasksExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </span>
                <p className="font-semibold ml-2">
                  Linked Tasks ({linkedTasks.length})
                </p>
              </div>
              {isLinkedTasksExpanded && (
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {linkedTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <Tag
                        color={
                          task.status === 'Completed'
                            ? 'green'
                            : task.status === 'In Progress'
                            ? 'orange'
                            : 'blue'
                        }
                        className="mr-2"
                      >
                        {task.status}
                      </Tag>
                      <span className="mr-3">{task.title}</span>
                      <span style={{ color: '#666', flex: 1 }}>#{task.id}</span>
                      <Avatar size={25} src={task.assignee.avatar}>
                        {task.assignee.firstName[0].toUpperCase()}
                        {task.assignee.lastName[0].toUpperCase()}
                      </Avatar>

                      <Button
                        type="text"
                        icon={<X size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskSelection(task);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>
        {isTaskLinkModalVisible && (
          <Popover
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="ml-3">Link Existing Tasks</span>
                <Button
                  type="text"
                  icon={<X size={18} style={{ color: 'grey' }} />}
                  onClick={closeTaskLinkModal}
                  style={{ marginLeft: 8 }}
                />
              </div>
            }
            content={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '360px',
                }}
              >
                <div
                  style={{ padding: '8px 12px', background: '#fff', zIndex: 1 }}
                >
                  <Input
                    placeholder="Search tasks..."
                    allowClear
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: '300px',
                    padding: '0 12px',
                  }}
                >
                  {tasks?.filter(
                    (task) =>
                      task.id !== editingData?.id && // Exclude current task
                      (task.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                        task.displayId.toString().includes(searchTerm) ||
                        task.status
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
                  )?.length > 0 ? (
                    tasks
                      ?.filter(
                        (task) =>
                          task.id !== editingData?.id && // Exclude current task
                          (task.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                            task.displayId.toString().includes(searchTerm) ||
                            task.status
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()))
                      )
                      ?.map((task) => (
                        <div
                          key={task.id}
                          className={`task-link-item ${
                            linkedTasks.some((t) => t.id === task.id)
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() => toggleTaskSelection(task)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 4px',
                            gap: '8px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: linkedTasks.some(
                              (t) => t.id === task.id
                            )
                              ? '#e6f7ff'
                              : 'transparent',
                          }}
                        >
                          <Tag
                            color={
                              task.status === 'Completed'
                                ? 'green'
                                : task.status === 'In Progress'
                                ? 'orange'
                                : 'blue'
                            }
                            style={{ margin: 0, flexShrink: 0 }}
                          >
                            {task.status}
                          </Tag>
                          <span
                            style={{
                              flex: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {task.title}
                          </span>
                          <span style={{ color: '#666', flexShrink: 0 }}>
                            #{task.displayId}
                          </span>
                        </div>
                      ))
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px',
                      }}
                    >
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No other tasks available to link"
                      />
                    </div>
                  )}
                </div>
              </div>
            }
            trigger="click"
            open={isTaskLinkModalVisible}
            onOpenChange={(visible) => {
              if (!visible) closeTaskLinkModal();
            }}
            placement="topLeft"
            overlayClassName="task-link-popover"
            overlayStyle={{
              boxShadow:
                '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
              borderRadius: 8,
              width: '400px',
              padding: 0,
            }}
            arrow={false}
          >
            <div style={{ display: 'inline-block' }}></div>
          </Popover>
        )}
        <Modal
          title="Task Comments"
          open={isCommentModalVisible}
          onCancel={hideCommentModal}
          on
          footer={
            <>
              <Divider />
              <Button className="mr-2" onClick={hideCommentModal}>
                Cancel
              </Button>
              <Button type="primary" onClick={() => form.submit()}>
                Comment
              </Button>
            </>
          }
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
            <CommentSection comments={comments} taskId={currentTaskId} />
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
            <Form
              form={form}
              onFinish={() => onCommentSubmit(newComment)}
              layout="vertical"
            >
              <Form.Item name="comment">
                <Mentions
                  value={newComment}
                  onChange={onCommentChange}
                  placeholder="Add your comment"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{
                    width: '100%',
                  }}
                  options={users?.map((u) => ({
                    label: (
                      <Space>
                        <Avatar src={u?.avatar} style={{ marginRight: 8 }}>
                          {!u?.avatar && `${u?.firstName[0]}`}{' '}
                        </Avatar>
                        <span>{u?.fullName}</span>
                      </Space>
                    ),
                    value: `${u?.fullName}`,
                  }))}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </Content>
  );
};

export default TaskList;
