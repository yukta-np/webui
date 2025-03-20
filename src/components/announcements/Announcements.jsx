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
} from 'antd';
import { FilePenLine, Handshake, Trash2Icon } from 'lucide-react';
const { Content } = Layout;
const { useBreakpoint } = Grid;
import { useState } from 'react';

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
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
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
          okText="Yes"
          cancelText="No"
          onConfirm={() => onDeleteClick(record)}
        >
          <Button type="link" icon={<Trash2Icon stroke="red" size={18} />} />
        </Popconfirm>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    id: 1,
    title: 'Announcement 1',
    createdBy: 'Alice',
    dueDate: '2024-03-01 12:00 AM',
  },
  {
    key: '2',
    id: 2,
    title: 'Announcement 2',
    createdBy: 'Bob',
    dueDate: '2024-03-15 01:00 PM',
  },
  {
    key: '3',
    id: 3,
    title: 'Announcement 3',
    createdBy: 'Charlie',
    dueDate: '2024-04-01 08:00 AM',
  },
];

const Announcements = () => {
  const screens = useBreakpoint();
  const { colorBgContainer, borderRadiusLG } = theme.useToken();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [shareToEveryone, setShareToEveryone] = useState(true);
  const [value, setValue] = useState();
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

  const onAddClick = () => {
    openModal();
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
          dataSource={data}
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
          width={shareToEveryone ? 700 : 1200}
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
          <Form form={form} onFinish={closeModal} layout="vertical">
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
                          <Select mode="multiple" placeholder="Select users">
                            <Select.Option value="pakLee">
                              Pak Lee
                            </Select.Option>
                            <Select.Option value="alice">Alice</Select.Option>
                            <Select.Option value="bob">Bob</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item label="Share with Groups" name="shareGroups">
                          <Select mode="multiple" placeholder="Select groups">
                            <Select.Option value="admins">Admins</Select.Option>
                            <Select.Option value="developers">
                              Developers
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item
                          label="User Black List (Don't share with users)"
                          name="userBlackList"
                        >
                          <Select
                            mode="multiple"
                            placeholder="Select users to exclude"
                          >
                            <Select.Option value="user1">User 1</Select.Option>
                            <Select.Option value="user2">User 2</Select.Option>
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
                            placeholder="Select users to exclude"
                          >
                            <Select.Option value="user1">User 1</Select.Option>
                            <Select.Option value="user2">User 2</Select.Option>
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
