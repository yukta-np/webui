'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Breadcrumb,
  Table,
  Row,
  Col,
  Divider,
  Popconfirm,
} from 'antd';
import Link from 'next/link';
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { FilePenLine, Send, Trash2Icon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const { Title, Text } = Typography;
const { Option } = Select;


// Mock Data
const initialStudentData = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    faculty: 'Science',
    program: 'Computer Science',
    startDate: '2023-01-01',
  },
  {
    key: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    faculty: 'Arts',
    program: 'English Literature',
    startDate: '2023-02-01',
  },
];

const initialAdministrationData = [
  {
    key: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'Administrator',
    department: 'IT',
    startDate: '2022-01-01',
  },
];

const initialTeacherData = [
  {
    key: '1',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah@example.com',
    department: 'Mathematics',
    subjects: ['Algebra', 'Calculus'],
    startDate: '2020-09-01',
  },
];

const initialStaffData = [
  {
    key: '1',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    role: 'Support staffs',
    department: 'Maintenance',
    startDate: '2021-05-01',
  },
];

// Options
const options = ['Administrator', 'Teacher', 'Support staffs', 'Student'];
const departmentOptions = [
  'IT',
  'Mathematics',
  'Science',
  'Arts',
  'Maintenance',
  'Administration',
];
const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
];

const settingsCards = [
  {
    id: 'administration',
    title: 'Administration',
    description: 'Manage administration staffs',
    icon: <UserOutlined className="text-blue-500 text-2xl" />,
  },
  {
    id: 'students',
    title: 'Students',
    description: 'Manage student records',
    icon: <BookOutlined className="text-blue-500 text-2xl" />,
  },
  {
    id: 'teachers',
    title: 'Teachers',
    description: 'Manage teaching staffs',
    icon: <CodeOutlined className="text-blue-500 text-2xl" />,
  },
  {
    id: 'staffs',
    title: 'staffs',
    description: 'Manage general staffs',
    icon: <TeamOutlined className="text-blue-500 text-2xl" />,
  },
];

const Settings = ({ currentType: propCurrentType }) => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = (pathname || '').split('/');
  const currentType = propCurrentType || segments[2] || '';

  // Fixed: State moved inside component and duplicates removed
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [data, setData] = useState({
    administration: initialAdministrationData,
    students: initialStudentData,
    teachers: initialTeacherData,
    staffs: initialStaffData,
  });

  const [modalVisible, setModalVisible] = useState({
    administration: false,
    students: false,
    teachers: false,
    staffs: false,
  });
  const [editingKey, setEditingKey] = useState({
    administration: null,
    students: null,
    teachers: null,
    staffs: null,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [propCurrentType]);

  const renderContent = () => {
    if (!currentType) return renderSettingsGrid();

    const titleMap = {
      administration: 'Administration staffs',
      students: 'Students',
      teachers: 'Teachers',
      staffs: 'General staffs',
    };

    if (!titleMap[currentType]) {
      return (
        <div className="p-6">
          <h1>Invalid section</h1>
          <Link href="/settings">Return to settings</Link>
        </div>
      );
    }

    // Common Columns (without action)
    const commonColumns = (type) => [
      {
        title: 'Name',
        key: 'name',
        render: (_, record) => `${record.firstName} ${record.lastName}`,
        sorter: (a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          ),
      },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    ];

    // Action Column Component
    const actionColumn = (type) => ({
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span className="space-x-2">
          <>
            <Button
              type="link"
              icon={<FilePenLine size={18} />}
              onClick={() => onEdit(type, record)}
            />
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(type, record)}
            >
              <Button
                type="link"
                danger
                icon={<Trash2Icon stroke="red" size={18} />}
              />
            </Popconfirm>
          </>

          {/* Add Send Links button only for students */}
          {type === 'students' && (
            <Popconfirm
              title="Send the links"
              description="Are you sure to send the links?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onSendLinks(type, record)}
            >
              <Button
                type="link"
                style={{ color: '#1890ff' }}
                confirm="Send Links"
                icon={<Send size={18} />}
              />
            </Popconfirm>
          )}
        </span>
      ),
    });

    // Send Links onr
    const onSendLinks = (record) => {
      // Send links to the student
      console.log('Sending links to', record);
    };
    // Specific Columns
    const administrationColumns = [
      ...commonColumns('administration'),
      { title: 'Role', dataIndex: 'role', key: 'role' },
      { title: 'Department', dataIndex: 'department', key: 'department' },
      actionColumn('administration'),
    ];

    const studentColumns = [
      ...commonColumns('students'),
      { title: 'Faculty', dataIndex: 'faculty', key: 'faculty' },
      { title: 'Program', dataIndex: 'program', key: 'program' },
      actionColumn('students'),
    ];

    const teacherColumns = [
      ...commonColumns('teachers'),
      { title: 'Department', dataIndex: 'department', key: 'department' },
      {
        title: 'Subjects',
        dataIndex: 'subjects',
        key: 'subjects',
        render: (subjects) => subjects.join(', '),
      },
      actionColumn('teachers'),
    ];

    const staffColumns = [
      ...commonColumns('staffs'),
      { title: 'Role', dataIndex: 'role', key: 'role' },
      { title: 'Department', dataIndex: 'department', key: 'department' },
      actionColumn('staffs'),
    ];

    // onrs
    const onAdd = (type) => {
      setEditingKey((prev) => ({ ...prev, [type]: null }));
      form.resetFields();
      setModalVisible((prev) => ({ ...prev, [type]: true }));
    };

    const onEdit = (type, record) => {
      setEditingKey((prev) => ({ ...prev, [type]: record.key }));
      form.setFieldsValue({
        ...record,
        startDate: record.startDate ? moment(record.startDate) : null,
        subjects: record.subjects || [],
      });
      setModalVisible((prev) => ({ ...prev, [type]: true }));
    };

    const onDelete = (type, key) => {
      Modal.confirm({
        title: `Delete this ${type.slice(0, -1)}?`,
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          setData((prev) => ({
            ...prev,
            [type]: prev[type].filter((item) => item.key !== key),
          }));
        },
      });
    };

    const onCancel = (type) => {
      setModalVisible((prev) => ({ ...prev, [type]: false }));
      form.resetFields();
      setEditingKey((prev) => ({ ...prev, [type]: null }));
    };

    const onOk = (type) => {
      form.validateFields().then((values) => {
        const newEntry = {
          ...values,
          key: editingKey[type] || String(Date.now()),
          startDate: values.startDate?.format('YYYY-MM-DD'),
          subjects: values.subjects || [],
        };

        setData((prev) => ({
          ...prev,
          [type]: editingKey[type]
            ? prev[type].map((item) =>
                item.key === editingKey[type] ? newEntry : item
              )
            : [...prev[type], newEntry],
        }));

        onCancel(type);
      });
    };

    // Modal Forms
    const renderForm = (type) => (
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>

          {type === 'administration' && (
            <>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={options.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="department" label="Department">
                  <Select
                    options={departmentOptions.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          {type === 'students' && (
            <>
              <Col span={12}>
                <Form.Item
                  name="faculty"
                  label="Faculty"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="program"
                  label="Program"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </>
          )}

          {type === 'teachers' && (
            <>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={departmentOptions.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="subjects" label="Subjects">
                  <Select
                    mode="multiple"
                    options={subjectOptions.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          {type === 'staffs' && (
            <>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={options.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="department" label="Department">
                  <Select
                    options={departmentOptions.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    );

    return (
      <div className="p-6">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link href="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/settings">Settings</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{titleMap[currentType]}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={3} className="mb-1">
                {titleMap[currentType]} Management
              </Title>
              <Text type="secondary">Manage {currentType} records</Text>
            </div>
            <Button type="primary" onClick={() => onAdd(currentType)}>
              Add
            </Button>
          </div>

          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: (newSelectedKeys) =>
                setSelectedRowKeys(newSelectedKeys),
            }}
            columns={
              currentType === 'administration'
                ? administrationColumns
                : currentType === 'students'
                ? studentColumns
                : currentType === 'teachers'
                ? teacherColumns
                : staffColumns // ons 'staffs' type
            }
            dataSource={data[currentType]}
            pagination={{ pageSize: 10 }}
            bordered
            rowKey="key"
          />

          <Modal
            title={`${editingKey[currentType] ? 'Edit' : 'Add'} ${
              titleMap[currentType]
            }`}
            open={modalVisible[currentType]}
            onOk={() => onOk(currentType)}
            onCancel={() => onCancel(currentType)}
            width={800}
          >
            {renderForm(currentType)}
          </Modal>
        </div>
      </div>
    );
  };

  const renderSettingsGrid = () => (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Settings</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="p-4 rounded-lg shadow-sm">
        <Row gutter={[24, 24]}>
          {settingsCards.map((card) => (
            <Col xs={24} sm={12} md={8} lg={6} key={card.id}>
              <Link href={`/${card.id}`}>
                <Card hoverable className="h-full border-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">{card.icon}</div>
                    <div>
                      <Title level={5} style={{ margin: 0, color: '#3182CE' }}>
                        {card.title}
                      </Title>
                      <Text type="secondary">{card.description}</Text>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );

  return <div className="min-h-screen bg-gray-50">{renderContent()}</div>;
};

export default Settings;
