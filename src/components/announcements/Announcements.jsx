import React, { useEffect, useMemo, useState } from 'react';
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
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Switch,
  Avatar,
  TreeSelect,
  Divider,
} from 'antd';
import { FilePenLine, Handshake, Trash2Icon } from 'lucide-react';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { useGroups } from '@/hooks/useGroup';
import { useUsers } from '@/hooks/useUsers';
import { constants, headers } from '@/constants';
import { openNotification } from '@/utils';
import axios from 'axios';
import moment from 'moment';

const { Content } = Layout;
const { useBreakpoint } = Grid;

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
  const label = option.data.children;
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
      id: '1',
      pId: null,
      value: '1',
      title: 'Expand to load',
    },
  ]);

  const {
    announcements,
    isLoading: announcementsLoading,
    revalidate: revalidateAnnouncements,
  } = useAnnouncement();
  const { groups, isLoading: groupsLoading } = useGroups();
  const { users, isLoading: usersLoading } = useUsers();


  useEffect(() => {
    if (!shareToEveryone) {
      form.setFieldsValue({
        shareUsers: [],
        shareGroups: [],
        userBlackList: [],
        groupBlackList: [],
      });
    }
  }, [shareToEveryone, form]);

  const handleEditClick = (record) => {
    setAction('edit');
    setCurrentAnnouncement(record);

    const initialValues = {
      ...record,
      dueDate: record.dueDate ? moment(record.dueDate) : null,
      shareToEveryone: record.everyone,
    };

    form.setFieldsValue(initialValues);
    setShareToEveryone(record.everyone);
    setIsModalVisible(true);
  };

  

 const onViewClick = (record) => {
   const newRecord = {
     title: record?.title,
     description: record?.description,
     dueDate: record?.dueDate ? moment(record?.dueDate) : null,
     shareToEveryone: record?.everyone,
     shareUsers: record?.shareUsers,
     shareGroups: record?.shareGroups,
     userBlackList: record?.userBlackList,
     groupBlackList: record?.groupBlackList,
     documents: record?.documents,
   };

   setAction('view');
   setCurrentAnnouncement(announcements);
   form.setFieldsValue(newRecord);
   setIsModalVisible(true);
 };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${constants.urls.announcementUrl}/${id}`, {
        headers,
      });
      openNotification('Announcement deleted successfully');
      revalidateAnnouncements();
    } catch (error) {
      openNotification('Failed to delete announcement', true);
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
        setTreeData((prev) =>
          prev.concat([
            genTreeNode(id, false),
            genTreeNode(id, true),
            genTreeNode(id, true),
          ])
        );
        resolve();
      }, 300);
    });

  const onFinish = async (values) => {
    try {
      setIsProcessing(true);
      const url =
        action === 'edit'
          ? `${constants.urls.announcementUrl}/${currentAnnouncement.id}`
          : constants.urls.announcementUrl;

      const method = action === 'edit' ? 'patch' : 'post';
      const payload = {
        ...values,
        dueDate: values.dueDate?.toISOString(),
      };

      await axios[method](url, payload, { headers });
      openNotification(
        `Announcement ${ action === 'edit' ? 'updated' : 'added'} successfully`
      );
      revalidateAnnouncements();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      openNotification(`Failed to ${action} announcement`, true);
      console.error('Submission error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '8%',
        render: (text, record) => (
          <a
            className="text-blue-600"
            onClick={() => onViewClick(record)}
          >
            {announcements?.displayId}{' '}ANC-{text}
          </a>
        ),
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
        render: (_, record) => record.creator?.fullName || 'N/A',
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
            <Popover content="Acknowledge by" trigger="hover">
              <Button type="link" icon={<Handshake size={18} />} />
            </Popover>
            <Button
              type="link"
              icon={<FilePenLine size={18} />}
              onClick={() => handleEditClick(record)}
            />
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                type="link"
                icon={<Trash2Icon stroke="red" size={18} />}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete]
  );

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
          <Button type="primary" onClick={() => setIsModalVisible(true)}
           >
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
          title={`${
            action === 'add' ? 'Add' : action === 'edit' ? 'Edit' : action === 'add' ? 'Add' : 'Edit'
          } Announcement`}
          width={shareToEveryone ? 500 : 1000}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={
            action === 'add' ? (
              <>
                <Divider />
                <Button className="mr-2" onClick={isModalVisible}>
                  Cancel
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Add
                </Button>
              </>
            ) : action === 'edit' ? (
              <>
                <Divider />
                <Button
                  className="mr-2"
                  onClick={() => setIsModalVisible(false)}
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Update
                </Button>
              </>
            ) : (
              <>
                <Divider />
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              </>
            )
          }
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            disabled={action === 'view'}
            
          >
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
                        // onChange={onChange}
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
                            {groups?.map((group) => (
                              <Select.Option key={group.id} value={group.id}>
                                {group.name}
                              </Select.Option>
                            ))}
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
                            {groups?.map((group) => (
                              <Select.Option key={group.id} value={group.id}>
                                {group.name}
                              </Select.Option>
                            ))}
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
