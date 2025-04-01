import React from 'react';
import {
  Layout,
  Grid,
  Button,
  Modal,
  Breadcrumb,
  theme,
  Table,
  Space,
  Popconfirm,
  Form,
  Input,
  Row,
  Col,
  Select,
  Avatar,
  Divider,
} from 'antd';
import { FilePenLine, Trash2Icon, CircleCheck } from 'lucide-react';
import Link from 'next/link';
import moment from 'moment';
import { useOrganisation } from '@/hooks/useOrganisation';

const { Content } = Layout;
const { useBreakpoint } = Grid;
const OrganisationList = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { organisation } = useOrganisation();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a className="text-blue-500" href={`/organisations/${record.id}`}>
          {text}
        </a>
      ),
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (_, record) => (
        <Space size="middle">
          {record.isActive === true && <CircleCheck stroke="#00bf00" />}
        </Space>
      ),
    },
    {
      title: 'Created Date/Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm A'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<FilePenLine size={18} />} />
          <Popconfirm
            title="Delete this organisation?"
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<Trash2Icon stroke="red" size={18} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Organisations</Breadcrumb.Item>
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
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <p className="text-xl font-bold">Organisations</p>
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexDirection: screens.xs ? 'column' : 'row',
              alignItems: 'center',
            }}
          >
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Add New
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={organisation}
          bordered
          pagination
        />
        <Modal
          title="Organisation"
          open={isModalOpen}
          onCancel={closeModal}
          width={700}
        >
          <Divider />
          <Form form={form} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input organisation name!',
                    },
                  ]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="domain" label="Domain">
                  <Input placeholder="e.g. xyz.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter email',
                    },
                  ]}
                >
                  <Input placeholder="Email" type="email" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="interactionEmail" label="Interaction Email">
                  <Input placeholder="e.g. xyz.com" />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter organisation address!',
                    },
                  ]}
                >
                  <Input placeholder="Address" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="phone" label="Phone">
                  <Input placeholder="Phone" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <p className="text-lg font-semibold mb-3">Org Admin Details</p>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please enter first name!' },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please enter last name!' },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: 'Please enter a valid email!',
                    },
                  ]}
                >
                  <Input placeholder="contact@domain.com" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider />
        </Modal>
      </div>
    </Content>
  );
};

export default OrganisationList;
