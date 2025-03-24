import React, { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Space,
  Select,
  Avatar,
  Table,
  Modal,
  Spin,
  Form,
  Input,
  message,
  Popconfirm,
  Dropdown,
  Menu,
} from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useGroups } from '@/hooks/useGroup';
import { useUsers } from '@/hooks/useUsers';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';
import { EllipsisVertical, Eye, Pencil, Trash2Icon } from 'lucide-react';
import { createGroup, updateGroup } from '@/services/groups.http';
import { usePermissionGroup } from '@/hooks/usePermissionGroup';
import { Actions } from '@/constants';

const { Option } = Select;

const GroupList = ({ filterByCreator, filterByStatus }) => {
  const [openModal, setModalVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [action, setAction] = useState(Actions.add);
  const [form] = Form.useForm();

  const screens = {
    xs: useMediaQuery({ maxWidth: 576 }),
  };

  const {
    groups,
    meta: groupMeta,
    isLoading,
    isError,
    revalidate,
  } = useGroups();

  const { permissionGroups } = usePermissionGroup();

  console.log('groups', groups);
  const { users } = useUsers();

  const groupStatus = [{ name: 'Active' }, { name: 'Inactive' }];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'displayId',
      key: 'displayId',
    },
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Number of Members',
      dataIndex: 'groupUsers',
      key: 'members',
      render: (users) => <p>{users?.length || 0}</p>,
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
      render: (text) => <p>{text?.fullName}</p>, 
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm A'),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm A'),
    },
    {
      title: 'Status',
      dataIndex: 'deletedAt',
      key: 'status',
      render: (deletedAt) => <p>{deletedAt ? 'Inactive' : 'Active'}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) =>
        screens.md ? (
          <Space size="middle">
            <>
              <Button
                type="link"
                icon={<FilePenLine size={18} />}
                onClick={() => onEdit(record)}
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

  const userColumns = [
    {
      title: 'Full Name',
      dataIndex: ['user', 'fullName'],
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Joined At',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const onAdd = () => {
    setAction(Actions.add);
    setCurrentGroup(null);
    form.resetFields();
    setModalVisible(true);
  };

  const onDeleteClick = (group) => {
    console.log('Deleting:', group);
  };

  const onEdit = (group) => {
    setAction(Actions.edit);
    setCurrentGroup({
      ...group,
      userIds: group.groupUsers?.map((gu) => gu.user.id) || [],
    });
    setModalVisible(true);
  };

  const onSubmit = async (values) => {
    try {
      setIsProcessing(true);
      const res =
        action === Actions.add
          ? createGroup(values)
          : updateGroup(currentGroup.id, values);
      setModalVisible(false);
      message.success(`Group ${action}ed successfully!`);
      revalidate();
    } catch (error) {
      console.log(error);
      message.error('Please fill all required fields correctly');
    } finally {
      setIsProcessing(false);
    }
  };

  const onTableChange = (pagination, filters, sorter) => {
    const options = {
      limit: pagination.pageSize,
      page: pagination.current,
    };
    revalidate(options);
  };

  return (
    <div style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Groups</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: '#fff',
          borderRadius: 8,
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
          <p className="text-xl font-bold">Groups</p>
          <Button type="primary" onClick={onAdd}>
            Add Group
          </Button>
        </div>

        <Space style={{ justifyContent: 'space-between', gap: '24px' }}>
          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>By Creator </p>
            <Select
              allowClear
              optionLabelProp="label"
              showSearch
              style={{ width: 200 }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              onChange={filterByCreator}
            >
              {users?.map((u) => (
                <Option key={u?.id} value={u?.id} label={u?.fullName}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={u?.avatar} style={{ marginRight: 8 }}>
                      {!u?.avatar && u?.firstName[0]}
                    </Avatar>
                    <span>{u?.fullName}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Space>

          <Space direction="vertical" size={12} style={{ marginBottom: 16 }}>
            <p>By Status </p>
            <Select
              showSearch
              style={{ width: 200 }}
              allowClear
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={groupStatus?.map((gs) => ({
                label: gs?.name,
                value: gs?.name,
              }))}
              onChange={filterByStatus}
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
                { value: 'false', label: 'No' },
                { value: 'true', label: 'Yes' },
              ]}
            />
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={groups}
          expandable={{
            expandedRowRender: (record) => (
              <Table
                columns={userColumns}
                dataSource={record.groupUsers}
                rowKey={(user) => user.id}
                pagination={false}
                size="small"
              />
            ),
            rowExpandable: (record) =>
              record.groupUsers && record.groupUsers.length > 0,
          }}
          pagination={{
            total: groupMeta?.totalRows,
            pageSize: groupMeta?.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            responsive: true,
          }}
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content' }}
          bordered
          size="middle"
          style={{
            minWidth: '100%',
            overflowX: 'auto',
          }}
          onChange={onTableChange}
        />
        <Modal
          title={currentGroup ? 'Edit Group' : 'Add New Group'}
          open={openModal}
          onOk={() => form.submit()}
          onCancel={() => setModalVisible(false)}
          confirmLoading={isProcessing}
        >
          <Spin spinning={isProcessing}>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
              <Form.Item
                name="name"
                label="Group Name"
                rules={[
                  { required: true, message: 'Please input group name!' },
                ]}
              >
                <Input placeholder="Enter group name" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please input description!' },
                ]}
              >
                <TextArea rows={4} placeholder="Enter group description" />
              </Form.Item>

              <Form.Item
                name="permissionGroupId"
                label="Permission Group"
                rules={[
                  {
                    required: true,
                    message: 'Please select permission group!',
                  },
                ]}
              >
                <Select
                  placeholder="Select permission group"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={permissionGroups?.map((pg) => ({
                    label: pg?.name,
                    value: pg?.id,
                  }))}
                />
              </Form.Item>

              <Form.Item name="userIds" label="Group Members">
                <Select
                  mode="multiple"
                  placeholder="Select members"
                  value={selectedUserIds}
                  onChange={setSelectedUserIds}
                  showSearch
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                  options={users?.map((user) => ({
                    label: `${user.fullName}`,
                    value: user.id,
                  }))}
                />
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </div>
    </div>
  );
};

export default GroupList;
