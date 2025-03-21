import React from 'react';
import {
  Table,
  Space,
  Layout,
  Grid,
  Breadcrumb,
  theme,
  Button,
  Popconfirm,
  Popover,
  Modal,
  Divider,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Switch,
  Avatar,
  TreeSelect,
  Tag,
} from 'antd';
import { FilePenLine, Handshake, Trash2Icon } from 'lucide-react';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { useGroups } from '@/hooks/useGroup';
import { useUsers } from '@/hooks/useUsers';
import { constants, headers } from '@/constants';
const { Content } = Layout;
const { useBreakpoint } = Grid;
import { useState } from 'react';
import { openNotification } from '@/utils';
import axios from 'axios';
import moment from 'moment';

const tagRender = (props) => {
  const { label, closable, onClose } = props;
  const firstLetter = label?.[0]?.toUpperCase() || '';

  return (
    <span
      style={{ marginRight: 3, display: 'inline-flex', alignItems: 'center' }}
    >
      <Avatar
        size={20}
        style={{
          marginRight: 5,
          backgroundColor: '#1890ff',
          color: '#fff',
          fontSize: 12,
        }}
      >
        {firstLetter}
      </Avatar>
      {label}
      {closable && (
        <span style={{ marginLeft: 4, cursor: 'pointer' }} onClick={onClose}>
          ×
        </span>
      )}
    </span>
  );
};
const optionRender = (option) => {
  const label = option.data.children; // Get the actual label text
  const firstLetter = typeof label === 'string' ? label[0]?.toUpperCase() : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar
        size={20}
        style={{
          marginRight: 8,
          backgroundColor: '#1890ff',
          color: '#fff',
          fontSize: 12,
        }}
      >
        {firstLetter}
      </Avatar>
      {label}
    </div>
  );
};

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '8%',
    render: (text, record) => <a className="text-blue-600">ANC-{text}</a>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Created By',
    dataIndex: 'createdBy',
    key: 'createdBy',
    render: (text, record) =>
      record.creator ? `${record.creator?.fullName}` : 'N/A',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (text) => moment(text).format('DD/MM/YYYY hh:mm a'),
  },
  {
    title: 'Action',
    key: 'action',
    width: '10%',
    render: (_, record) => (
      <Space size="middle">
        <Popover content={`Acknowledge by `} trigger="hover">
          <Button type="link" icon={<Handshake size={18} />} />
        </Popover>
        <Button type="link" icon={<FilePenLine size={18} />} />
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" icon={<Trash2Icon stroke="red" size={18} />} />
        </Popconfirm>
      </Space>
    ),
  },
];

const Announcements = () => {
  const screens = useBreakpoint();
  const { colorBgContainer, borderRadiusLG } = theme.useToken();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [shareToEveryone, setShareToEveryone] = useState(true);
  const [action, setAction] = useState('add');
  const [isProcessing, setIsProcessing] = useState(false);
  const [value, setValue] = useState();
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [treeData, setTreeData] = useState([
    {
      id: 1,
      pId: 0,
      value: '1',
      title: 'Expand to load',
    },
    {
      id: 2,
      pId: 0,
      value: '2',
      title: 'Expand to load',
    },
    {
      id: 3,
      pId: 0,
      value: '3',
      title: 'Tree Node',
      isLeaf: true,
    },
  ]);

  const announcementUrl = constants.urls.announcementUrl;

  const {
    announcements,
    isLoading: announcementsLoading,
    isError: announcementsError,
    revalidate: revalidateAnnouncements,
  } = useAnnouncement({
    disableAutoRefetch: true,
  });

  // Fetch groups and users for select options
  const { groups, isLoading: groupsLoading } = useGroups();
  const { users, isLoading: usersLoading } = useUsers();

  // Delete handler using your existing API setup
  const handleDelete = async (id) => {
    try {
      await fetch(`${constants.urls.announcementUrl}/${id}`, {
        method: 'DELETE',
      });
      revalidateAnnouncements();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const genTreeNode = (parentId, isLeaf = false) => {
    const random = Math.random().toString(36).substring(2, 6);
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
    };
  };

  const onLoadData = ({ id }) =>
    new Promise((resolve) => {
      setTimeout(() => {
        setTreeData(
          treeData.concat([
            genTreeNode(id, false),
            genTreeNode(id, true),
            genTreeNode(id, true),
          ])
        );
        resolve(undefined);
      }, 300);
    });

  const onChange = (newValue) => {
    setValue(newValue);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      setIsProcessing(true);
      if (action === 'add') {
        console.log('ma yua chu');
        console.log('url', announcementUrl);
        console.log('values', values);
        const res = await axios.post(announcementUrl, values, { headers });
        console.log('res', res);
        console.log('aba');
        openNotification('Announcement added successfully.');
      } else if (action === 'edit' && currentAnnouncement?.id) {
        console.log('ma yua pani chu');
        await axios.patch(
          `${announcementUrl}/${currentAnnouncement.id}`,
          values,
          {
            headers,
          }
        );
        openNotification('Announcement updated successfully.');
      }
      mutate(announcementUrl);
      // closeModal();
    } catch (e) {
      openNotification('Failed to save announcement.', true);
    } finally {
      setIsProcessing(false);
    }
  };

  const onAddClick = () => {
    openModal();
    setAction('add');
  };

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Announcements </Breadcrumb.Item>
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
          <p className="text-xl font-bold">Announcements</p>
          <Button type="primary" onClick={onAddClick}>
            Add New
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={announcements}
          scroll={{ x: 'max-content' }}
          bordered
          size={screens.xs ? 'small' : 'middle'}
          style={{
            minWidth: screens.xs ? '100%' : 'auto',
            overflowX: 'auto',
          }}
        />
        <Modal
          title="Add Announcement"
          open={isModalVisible}
          onCancel={closeModal}
          onOk={closeModal}
          width={shareToEveryone ? 500 : 1000}
          footer={
            <>
              {/* <Divider /> */}
              <Button className="mr-2" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="primary" onClick={() => form.submit()}>
                Add
              </Button>
            </>
          }
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <div className={shareToEveryone ? '' : 'grid grid-cols-2 gap-4'}>
              <div>
                <Row gutter={24}>
                  <Col xs={24}>
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[
                        { required: true, message: 'Please enter a title' },
                      ]}
                    >
                      <Input placeholder="Enter task title" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24}>
                    <Form.Item
                      label="Select Documents"
                      name="selectedDocuments"
                    >
                      <TreeSelect
                        treeDataSimpleMode
                        style={{ width: '100%' }}
                        value={value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Please select"
                        onChange={onChange}
                        loadData={onLoadData}
                        treeData={treeData}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter a description',
                        },
                      ]}
                    >
                      <Input.TextArea
                        placeholder="Enter the description"
                        style={{ height: 100 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={12}>
                    <Form.Item label="Due Date" name="dueDate">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item label="Share to Everyone" name="everyone">
                      <Switch
                        defaultChecked
                        onChange={(checked) => setShareToEveryone(checked)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {!shareToEveryone && (
                <>
                  <div className="pl-4 border-l border-gray-200">
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item label="Share with Users" name="shareUsers">
                          <Select
                            mode="multiple"
                            placeholder="Select user to exclude"
                            tagRender={tagRender}
                            optionRender={optionRender}
                            loading={usersLoading}
                          >
                            {users?.map((user) => (
                              <Select.Option key={user.id} value={user.id}>
                                {user.fullName}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item label="Share with Groups" name="shareGroups">
                          <Select
                            mode="multiple"
                            placeholder="Select group to exclude"
                            tagRender={tagRender}
                            optionRender={optionRender}
                          >
                            <Select.Option value="user1">Group 1</Select.Option>
                            <Select.Option value="user2">Group 2</Select.Option>
                            <Select.Option value="user3">
                              Marketing Team
                            </Select.Option>
                            <Select.Option value="user4">
                              Sales Department
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item
                          label="User Black List (Don't share with these users)"
                          name="userBlackList"
                        >
                          <Select
                            mode="multiple"
                            placeholder="Select user to exclude"
                            tagRender={tagRender}
                            optionRender={optionRender}
                          >
                            <Select.Option value="user1">User 1</Select.Option>
                            <Select.Option value="user2">User 2</Select.Option>
                            <Select.Option value="user3">
                              Dip Ojha
                            </Select.Option>
                            <Select.Option value="user4">
                              John Doe
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item
                          label="Group Black List (Don't share with these groups)"
                          name="groupBlackList"
                        >
                          <Select
                            mode="multiple"
                            placeholder="Select group to exclude"
                            tagRender={tagRender}
                            optionRender={optionRender}
                          >
                            <Select.Option value="user1">Group 1</Select.Option>
                            <Select.Option value="user2">Group 2</Select.Option>
                            <Select.Option value="user3">
                              Marketing Team
                            </Select.Option>
                            <Select.Option value="user4">
                              Sales Department
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            </div>
          </Form>
        </Modal>
      </div>
    </Content>
  );
};

export default Announcements;
