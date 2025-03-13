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
          footer={
            <>
              <Divider />
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
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter a title' }]}
                >
                  <Input placeholder="Enter task title" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item label="Select Documents" name="description">
                  <Select mode="multiple" placeholder="Select documents">
                    <Option value="1">Option 1</Option>
                    <Option value="2">Option 2</Option>
                    <Option value="3">Option 3</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        ;
      </div>
    </Content>
  );
};

export default Announcements;
