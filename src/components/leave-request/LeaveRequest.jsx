import React, { use, useState } from 'react';
import {
  Breadcrumb,
  Layout,
  Table,
  theme,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Tabs,
  Dropdown,
  Menu,
  Grid,
  Tag,
  Flex,
  Divider,
  Select,
  DatePicker,
  Switch,
  InputNumber,
} from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import { FaEdit, FaEye } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import Link from 'next/link';
import moment from 'moment';
import { dateRanges } from '@/utils';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const LeaveRequest = ({
  isAllLeave = false,
  isMyLeave = false,
  isMyTeamLeave = false,
}) => {
  const screens = useBreakpoint();
  console.log({ isAllLeave, isMyLeave, isMyTeamLeave });
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState('add');
  const [decision, setDecision] = useState('');
  const [transfer, setTransfer] = useState(null);
  console.log(transfer);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onAddClick = () => {
    setAction('add');
    openModal();
  };

  const onAcceptRejectClick = () => {
    setAction('accept-reject');
    openModal();
  };

  const getTitle = () => {
    if (action === 'add') {
      return 'Apply for Leave';
    } else if (action === 'accept-reject') {
      return 'Accept / Reject Leave';
    }
  };

  console.log(getTitle());

  const columns = [
    ...(!isMyLeave
      ? [
          {
            title: 'Teacher / Staff Member Name',
            dataIndex: 'name',
            key: 'name',
            responsive: ['lg'],
          },
        ]
      : []),

    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      responsive: ['md'],
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      responsive: ['md'],
    },
    {
      title: 'Hour/Days',
      dataIndex: 'hourDays',
      key: 'hourDays',
      responsive: ['md'],
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      responsive: ['lg'],
    },
    {
      title: 'Decided At',
      dataIndex: 'decidedAt',
      key: 'decidedAt',
      responsive: ['sm'],
    },
    {
      title: 'Decided By',
      dataIndex: 'decidedBy',
      key: 'decidedBy',
      responsive: ['sm'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['sm'],
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) =>
        screens.md ? (
          <Space size="middle">
            <Button type="link" icon={<FaEye />} />

            <Button
              type="link"
              icon={<FaEdit />}
              onClick={() => console.log(record.key)}
            />
            {isMyLeave && (
              <>
                <Button
                  type="link"
                  danger
                  icon={<RiDeleteBin6Fill />}
                  onClick={() => console.log(record.key)}
                />
              </>
            )}
            {!isMyLeave && (
              <Flex wrap className="site-button-ghost-wrapper ">
                <Button
                  type="primary"
                  danger
                  ghost
                  size="medium"
                  onClick={onAcceptRejectClick}
                >
                  Accept/Reject
                </Button>
              </Flex>
            )}
          </Space>
        ) : (
          <Dropdown
            overlay={
              <Menu
                items={[
                  { key: 'view', label: 'View', icon: <EyeOutlined /> },
                  { key: 'edit', label: 'Edit', icon: <EditOutlined /> },
                  {
                    key: 'delete',
                    label: 'Delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        ),
    },
  ];

  const data = [
    {
      name: 'John Doe',
      startDate: '2025-02-28',
      endDate: '2025-03-05',
      hourDays: '2 days',
      leaveType: 'sick leave',
      decidedAt: '2025-02-28',
      decidedBy: 'John Doe',
      status: 'pending',
    },
    {
      name: 'John Doe',
      startDate: '2025-02-28',
      endDate: '2025-03-05',
      hourDays: '8 hour',
      leaveType: 'sick leave',
      decidedAt: '2025-02-28',
      decidedBy: 'John Doe',
      status: 'pending',
    },
    {
      name: 'John Doe',
      startDate: '2025-02-28',
      endDate: '2025-03-05',
      hourDays: '7 days',
      leaveType: 'sick leave',
      decidedAt: '2025-02-28',
      decidedBy: 'John Doe',
      status: 'pending',
    },
  ];

  const loggedInUser = {
    fullname: 'Abishek Ghimire',
  };

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {isMyLeave ? 'My Leave' : isAllLeave ? 'All Leave' : 'My Team Leave'}
        </Breadcrumb.Item>
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
          <h2 style={{ margin: 0 }}>
            {isMyLeave
              ? 'My Leave'
              : isAllLeave
              ? 'All Leave'
              : "My Team's Leave"}
          </h2>
          <Button type="primary" onClick={onAddClick}>
            Add New
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
            responsive: true,
          }}
          rowKey="key"
          scroll={{ x: 'max-content' }}
          bordered
          size={screens.xs ? 'small' : 'middle'}
          style={{
            minWidth: screens.xs ? '100%' : 'auto',
            overflowX: 'auto',
          }}
        />

        <Modal
          title={getTitle()}
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <Divider />
          <Form layout="vertical">
            {action === 'accept-reject' && (
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Logged Date/Time"
                    initialValue={moment()} // Set the initialValue to moment()
                  >
                    <DatePicker showTime disabled format="DD/MM/YYYY hh:mm A" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="loggedBy"
                    label="Logged by"
                    initialValue={loggedInUser.fullname}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {!isMyLeave && action !== 'accept-reject' && (
              <Col>
                <Form.Item
                  name="name"
                  label="Teacher / Staff Member Name"
                  rules={[{ required: true }]}
                  width="100%"
                >
                  <Select placeholder="Select a teacher or staff member">
                    <Select.Option value="sick leave">Sick Leave</Select.Option>
                    <Select.Option value="casual leave">
                      Casual Leave
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}

            <Col>
              <Form.Item
                name="leaveType"
                label="Leave Type"
                rules={[{ required: true }]}
                width="100%"
              >
                <Select>
                  <Select.Option value="sick leave">Sick Leave</Select.Option>
                  <Select.Option value="casual leave">
                    Casual Leave
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Form.Item>
              <p style={{ marginBottom: '5px' }}>All Day?</p>
              <Switch />
            </Form.Item>
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={12}>
                <Form.Item
                  name="fromDate"
                  label="From"
                  rules={[{ required: true }]}
                >
                  <DatePicker presets={dateRanges} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="toDate"
                  label="To"
                  rules={[{ required: true }]}
                >
                  <DatePicker presets={dateRanges} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="hourDays"
              label="Hour / Days"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item name="reason" label="Note to Approver">
              <Input.TextArea rows={4} />
            </Form.Item>
            {action === 'accept-reject' && (
              <>
                <Form.Item
                  name="decision"
                  label="Decision"
                  rules={[{ required: true }]}
                >
                  <Select onChange={(value) => setDecision(value)}>
                    <Select.Option value="approved">Approve</Select.Option>
                    <Select.Option value="rejected">Reject</Select.Option>
                  </Select>
                </Form.Item>
                {decision === 'rejected' && (
                  <Form.Item
                    name="rejectionReason"
                    label="Reason for Rejection"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                )}
                {decision === 'approved' && (
                  <Form.Item
                    name="actionForOverlap"
                    label="Action for overlapping with leave"
                    rules={[{ required: true }]}
                    value={transfer}
                  >
                    <Select onChange={(value) => setTransfer(value)}>
                      <Select.Option value="removeFromSession">
                        Remove from session
                      </Select.Option>
                      <Select.Option value="transferToAnother">
                        Transfer to another
                      </Select.Option>

                      <Select.Option value="doNothing">
                        Do Nothing
                      </Select.Option>
                    </Select>
                  </Form.Item>
                )}

                {transfer === 'transferToAnother' && (
                  <Form.Item
                    name="assigneeForOverlap"
                    label="Transfer To"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Select.Option value="1">John Doe</Select.Option>
                      <Select.Option value="2">Jane Doe</Select.Option>
                    </Select>
                  </Form.Item>
                )}
              </>
            )}

            <Space
              size="middle"
              style={{ justifyContent: 'flex-end', display: 'flex' }}
            >
              <Button type="default" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {action === 'add' ? 'Apply' : 'OK'}
              </Button>
            </Space>
          </Form>
        </Modal>
      </div>
    </Content>
  );
};

export default LeaveRequest;
