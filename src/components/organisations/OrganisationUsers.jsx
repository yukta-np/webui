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
import { FilePenLine, TimerReset, Search } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { openNotification, Roles } from '@/utils';
import { getUser, updateUser } from '@/services/users.http';

const OrganisationUsers = ({ params: { id } }) => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resettingUser, setResettingUser] = useState(null);
  const [searchInputs, setSearchInputs] = useState({
    name: '',
    email: '',
  });

  let params = {};
  if (id) {
    params.organisationId = id;
  }

  const { users, meta, revalidate } = useUsers(params);

  const roleOptions = Object.keys(Roles).map((key) => ({
    value: key,
    label: key,
  }));

  const roleColors = {
    [Roles.ADMIN]: 'red',
    [Roles.MANAGER]: 'blue',
    [Roles.TEACHER]: 'orange',
    [Roles.STAFF]: 'gold',
    [Roles.PARENT]: 'green',
    [Roles.STUDENT]: 'cyan',
  };

  const populateFrom = (data) => {
    form.setFieldsValue(data);
  };

  const onActiveChange = async (checked, users) => {
    console.log(users.id);
    try {
      await updateUser(users.id, { isActive: checked });
      openNotification('User updated successfully');
      await revalidate();
    } catch (error) {
      console.error('Error updating user:', error);
      openNotification('Failed to update user', true);
    }
  };

  const onEdit = async (id) => {
    const { data } = await getUser(id);
    populateFrom(data);
    setIsModalVisible(true);
  };

  const onResetPassword = (record) => {
    setResettingUser(record);
    setIsPasswordModalVisible(true);
  };

  const onPasswordReset = async () => {
    try {
      const values = await passwordForm.validateFields();
      message.success(
        `Password reset for ${resettingUser.firstName} ${resettingUser.lastName}`
      );
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  const onFinish = async (values) => {
    setIsProcessing(true);
    console.log(values);
    try {
      const payload = {
        ...values,
      };
      await updateUser(id, payload);
      setIsModalVisible(false);
      openNotification('User updated successfully');
      revalidate();
      form.resetFields();
    } catch (err) {
      openNotification('Failed to update user', true);
      console.log('Validation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const onSearch = (key, value) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onResetSearch = (key) => {
    setSearchInputs((prev) => ({ ...prev, [key]: '' }));
  };

  const filteredUsers = users?.filter((user) => {
    const fullName =
      `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
    const nameMatch = fullName.includes(searchInputs.name.toLowerCase());
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchInputs.email.toLowerCase());
    return nameMatch && emailMatch;
  });

  const validatePasswordConfirmation = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('newPassword') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match!'));
    },
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={searchInputs[dataIndex]}
          onChange={(e) => onSearch(dataIndex, e.target.value)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => onSearch(dataIndex, searchInputs[dataIndex])}
            icon={<Search size={14} />}
          >
            Search
          </Button>
          <Button size="small" onClick={() => onResetSearch(dataIndex)}>
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
          <Avatar size="default">
            {`${record.firstName[0].toUpperCase()}${record.lastName[0].toUpperCase()}`}
          </Avatar>
          <span className="font-medium">{`${record.fullName}`}</span>
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
      render: (role) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'active',
      render: (isActive, record) => (
        <Switch
          checked={!!isActive}
          onChange={(checked) => onActiveChange(checked, record)}
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
            onClick={() => onEdit(record.id)}
          />
          <Button
            type="link"
            danger
            icon={<TimerReset size={18} />}
            onClick={() => onResetPassword(record)}
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
          onChange={(e) => onSearch('name', e.target.value)}
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
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save
          </Button>,
        ]}
      >
        <Divider />
        <Form form={form} onFinish={onFinish} layout="vertical">
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
        onOk={onPasswordReset}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsPasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onPasswordReset}>
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
              validatePasswordConfirmation,
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
