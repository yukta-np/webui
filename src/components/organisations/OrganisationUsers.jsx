import React, { useState } from 'react';
import {
  Table,
  Switch,
  Button,
  Space,
  Input,
  Form,
  Modal,
  Select,
  Tag,
  Avatar,
  Row,
  Col,
  message,
  Divider,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { FilePenLine, TimerReset, Search } from 'lucide-react';

const OrganisationUsers = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);
  const [searchInputs, setSearchInputs] = useState({
    name: '',
    email: '',
  });

  // Sample data with avatar URLs
  const [users, setUsers] = useState([
    {
      key: '1',
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'admin',
      active: true,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      key: '2',
      firstName: 'Jane',
      middleName: 'Elizabeth',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'manager',
      active: false,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      key: '3',
      firstName: 'Bob',
      middleName: 'William',
      lastName: 'Johnson',
      email: 'bob@example.com',
      role: 'user',
      active: true,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
  ]);

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' },
  ];

  const handleStatusChange = (checked, record) => {
    const updatedUsers = users.map((user) =>
      user.key === record.key ? { ...user, active: checked } : user
    );
    setUsers(updatedUsers);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleResetPassword = (record) => {
    setResettingUser(record);
    setIsPasswordModalVisible(true);
  };

  const handlePasswordReset = () => {
    passwordForm
      .validateFields()
      .then((values) => {
        message.success(
          `Password reset for ${resettingUser.firstName} ${resettingUser.lastName}`
        );
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      })
      .catch((err) => console.log('Validation failed:', err));
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedUsers = users.map((user) =>
          user.key === editingUser.key ? { ...user, ...values } : user
        );
        setUsers(updatedUsers);
        setIsModalVisible(false);
        message.success('User updated successfully');
      })
      .catch((err) => console.log('Validation failed:', err));
  };

  const handleSearch = (key, value) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetSearch = (key) => {
    setSearchInputs((prev) => ({ ...prev, [key]: '' }));
  };

  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
    const nameMatch = fullName.includes(searchInputs.name.toLowerCase());
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchInputs.email.toLowerCase());
    return nameMatch && emailMatch;
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={searchInputs[dataIndex]}
          onChange={(e) => handleSearch(dataIndex, e.target.value)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleSearch(dataIndex, searchInputs[dataIndex])}
            icon={<Search size={14} />}
          >
            Search
          </Button>
          <Button
            size="small"
            onClick={() => handleResetSearch(dataIndex)}
            icon={<TimerReset size={14} />}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <Search size={14} style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  const columns = [
    {
      title: 'Full Name',
      key: 'name',
      ...getColumnSearchProps('name'),
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} size="default" />
          <span className="font-medium">
            {`${record.firstName} ${record.middleName} ${record.lastName}`}
          </span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      render: (email) => <span className="text-gray-600">{email}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag
          color={
            role === 'admin' ? 'red' : role === 'manager' ? 'blue' : 'green'
          }
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FilePenLine size={18} />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            danger
            icon={<TimerReset size={18} />}
            onClick={() => handleResetPassword(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">User Details</h1>
        <Input
          placeholder="Search name or email..."
          prefix={<Search size={18} />}
          style={{ width: 300 }}
          allowClear
          value={searchInputs.name}
          onChange={(e) => handleSearch('name', e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        bordered
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
      />

      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Divider />
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: 'Please input first name!' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="middleName" label="Middle Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please input last name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password for ${resettingUser?.firstName} ${resettingUser?.lastName}`}
        visible={isPasswordModalVisible}
        onOk={handlePasswordReset}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsPasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handlePasswordReset}>
            Reset
          </Button>,
        ]}
      >
        <Divider />
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganisationUsers;
