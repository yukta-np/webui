'use client';

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Breadcrumb,
  Table,
  Row,
  Col,
  Divider,
} from 'antd';
import Link from 'next/link';
import { BookOutlined, TeamOutlined, UserOutlined, CodeOutlined  } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data for admin staff
const initialAdminStaffData = [
  {
    key: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@college.edu',
    permissionGroup: 'Administrator',
    group: 'IT Services',
    designation: 'IT Support',
    phoneNumber: '+61234567890',
    mobileNumber: '+610987654321',
    startDate: '2023-01-01',
    endDate: '',
    maxHours: 40,
    sites: 'Main Campus',
    manager: 'Sandeep Bhardwaj',
  },
  {
    key: '2',
    firstName: 'Registrar',
    lastName: 'Office',
    email: 'registrar@college.edu',
    permissionGroup: 'Registrar Office',
    group: 'Administration',
    designation: 'Admin Staff',
    phoneNumber: '+61234567891',
    mobileNumber: '+610987654322',
    startDate: '2023-02-01',
    endDate: '2024-02-01',
    maxHours: 35,
    sites: 'Downtown Campus',
    manager: 'Joycee Lee',
  },
];

// Permission group options
const permissionGroups = [
  'Administrator',
  'Manager',
  'Staff',
  'Inquiry/Intake only',
  'Financial Officer',
  'Academic Staff',
  'Student Affairs',
  'Registrar Office',
];

// Group options
const groupOptions = [
  'Academic',
  'Administration',
  'Finance',
  'Student Services',
  'Faculty',
  'IT Services',
  'Library',
  'Maintenance',
];

// Designation options
const designationOptions = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Admin Staff',
  'Finance Officer',
  'IT Support',
  'Department Head',
  'Accounts Receivables (PRODA -NDIA Extracts and Reconciliation)',
];

// Settings card data
const settingsCards = [
  {
    id: 'administration-staff',
    title: 'Administration Staff',
    description: 'Manage roles and permissions',
    icon: <UserOutlined className="text-blue-500 text-2xl" />,
  },
  {
    id: 'student',
    title: 'Student ',
    description: 'Manage student roles and permissions',
    icon: <BookOutlined className="text-blue-500 text-2xl" />,
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'Manage staff roles and permissions',
    icon: <TeamOutlined className="text-blue-500 text-2xl" />,
  },
  {
    id: 'teachers',
    title: 'Teachers',
    description: 'Manage teacher roles and permissions',
    icon: <CodeOutlined className="text-blue-500 text-2xl" />,
  },
];

const Settings = () => {
  const [currentSetting, setCurrentSetting] = useState('');
  const [adminStaffData, setAdminStaffData] = useState(initialAdminStaffData);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
  const [adminEditingKey, setAdminEditingKey] = useState(null);
  const [form] = Form.useForm();

  // Admin Staff Columns
  const adminColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Permission Group',
      dataIndex: 'permissionGroup',
      key: 'permissionGroup',
      sorter: (a, b) => a.permissionGroup.localeCompare(b.permissionGroup),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      sorter: (a, b) => a.group.localeCompare(b.group),
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      sorter: (a, b) => a.designation?.localeCompare(b.designation),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span className="space-x-2">
          <Button
            type="link"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleAdminEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            className="text-red-500 hover:text-red-700"
            onClick={() => handleAdminDelete(record.key)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  // Handlers
  const showAdminModal = () => {
    setAdminEditingKey(null);
    form.resetFields();
    setIsAdminModalVisible(true);
  };

  const handleAdminEdit = (record) => {
    setAdminEditingKey(record.key);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
    });
    setIsAdminModalVisible(true);
  };

  const handleAdminDelete = (key) => {
    Modal.confirm({
      title: 'Delete this staff member?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setAdminStaffData(adminStaffData.filter((item) => item.key !== key));
      },
    });
  };

  const handleAdminCancel = () => {
    setIsAdminModalVisible(false);
    form.resetFields();
    setAdminEditingKey(null);
  };

  const handleAdminOk = () => {
    form.validateFields().then((values) => {
      const newEntry = {
        ...values,
        key: adminEditingKey || String(Date.now()),
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
      };

      if (adminEditingKey) {
        setAdminStaffData(
          adminStaffData.map((item) =>
            item.key === adminEditingKey ? newEntry : item
          )
        );
      } else {
        setAdminStaffData([...adminStaffData, newEntry]);
      }

      setIsAdminModalVisible(false);
      form.resetFields();
    });
  };

  // Render settings grid or detail view
  const renderContent = () => {
    if (!currentSetting) {
      return (
        <div className="p-6">
          <div className="mb-8">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item>
                <Link href="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Settings</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <Card className="p-4   rounded-lg shadow-sm">
            <Row gutter={[24, 24]}>
              {settingsCards.map((card) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={card.id}>
                  <Card
                    className="h-full cursor-pointer hover:shadow-md transition-shadow bg-white border-1"
                    onClick={() => setCurrentSetting(card.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">{card.icon}</div>
                      <div>
                        <Title style={{ margin: 0, color: '#3182CE' }} level={5}>
                          {card.title}
                        </Title>
                        <Text className="text-gray-500">
                          {card.description}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      );
    }
    if (currentSetting === 'administration-staff') {
      return (
        <div className="p-6">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item>
              <Link href="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a
                onClick={() => setCurrentSetting('')}
                className="cursor-pointer"
              >
                Settings
              </a>
            </Breadcrumb.Item>

            <Breadcrumb.Item>Administration Staff</Breadcrumb.Item>
          </Breadcrumb>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Title level={3} className="mb-1">
                  Staff Management
                </Title>
                <Text type="secondary">
                  Manage staff members and their permissions
                </Text>
              </div>
              <Button
                type="primary"
                onClick={showAdminModal}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Add
              </Button>
            </div>

            <Table
              columns={adminColumns}
              dataSource={adminStaffData}
              pagination={{ pageSize: 10 }}
              className="shadow-sm"
              bordered
              rowKey="key"
            />

            <Modal
              title={adminEditingKey ? 'Edit Staff Member' : 'Add Staff Member'}
              open={isAdminModalVisible}
              onOk={handleAdminOk}
              onCancel={handleAdminCancel}
              width={800}
              okText={adminEditingKey ? 'Update' : 'Add'}
              cancelText="Cancel"
            >
              <Form form={form} layout="vertical" className="mt-4">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[
                        { required: true, message: 'Please enter first name' },
                      ]}
                    >
                      <Input placeholder="Enter first name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[
                        { required: true, message: 'Please enter last name' },
                      ]}
                    >
                      <Input placeholder="Enter last name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter a valid email' },
                      ]}
                    >
                      <Input placeholder="Enter email address" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[
                        { required: true, message: 'Please select role' },
                      ]}
                    >
                      <Select placeholder="Select role">
                        <Select.Option value="student">Student</Select.Option>
                        <Select.Option value="teacher">Teacher</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="startDate"
                      label="Start Date"
                      rules={[
                        { required: true, message: 'Please select start date' },
                      ]}
                    >
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="endDate" label="End Date">
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </Col>
                </Row> */}

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="permissionGroup"
                      label="Permission Group"
                      rules={[
                        {
                          required: true,
                          message: 'Please select permission group',
                        },
                      ]}
                    >
                      <Select placeholder="Select permission group">
                        {permissionGroups.map((group) => (
                          <Option key={group} value={group}>
                            {group}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="group" label="Group">
                      <Select placeholder="Select group">
                        {groupOptions.map((group) => (
                          <Option key={group} value={group}>
                            {group}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="maxHours"
                      label="Max Hours Per Week"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter max hours per week',
                        },
                      ]}
                    >
                      <InputNumber min={1} max={168} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="sites" label="Sites">
                      <Input placeholder="Enter sites" />
                    </Form.Item>
                  </Col>
                </Row> */}

                {/* <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="manager" label="Manager">
                      <Select placeholder="Select manager">
                        <Option value="Sandeep Bhardwaj">
                          Sandeep Bhardwaj
                        </Option>
                        <Option value="Joycee Lee">Joycee Lee</Option>
                        <Option value="John Smith">John Smith</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="designation" label="Designation">
                      <Select placeholder="Select designation">
                        {designationOptions.map((designation) => (
                          <Option key={designation} value={designation}>
                            {designation}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row> */}

                <Divider/>
                <Typography.Title level={5} style={{ marginBottom: '12px' }}>Contact Information</Typography.Title>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="phoneNumber" label="Phone Number">
                      <Input addonBefore="+977" placeholder="Phone Number" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="mobileNumber" label="Mobile Number">
                      <Input addonBefore="+977" placeholder="Mobile Number" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link href="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => setCurrentSetting('')} className="cursor-pointer">
              Settings
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {settingsCards.find((card) => card.id === currentSetting)?.title ||
              'Settings Detail'}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Card className="bg-white shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            {settingsCards.find((card) => card.id === currentSetting)?.icon}
            <Title level={3}>
              {settingsCards.find((card) => card.id === currentSetting)?.title}
            </Title>
          </div>
          <Text>This setting section is currently under development.</Text>
        </Card>
      </div>
    );
  };

  return <div className="min-h-screen bg-gray-50">{renderContent()}</div>;
};

export default Settings;
