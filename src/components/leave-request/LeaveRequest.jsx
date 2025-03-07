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
  Popconfirm,
} from 'antd';
import { EllipsisVertical, FilePenLine, Trash2Icon, Eye } from 'lucide-react';
import Link from 'next/link';
import moment from 'moment';
import { dateRanges, openNotification } from '@/utils';
import { useLeaveRequest } from '@/hooks/useLeaveRequest';
import {
  createLeaves,
  updateLeaves,
  deleteLeaves,
} from '@/services/leaves.http';
import { data } from 'autoprefixer';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState('add');
  const [decision, setDecision] = useState('');
  const [transfer, setTransfer] = useState(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [editingData, setEditingData] = useState(null);

  let params = {};
  const loggedInUser = {
    userId: 8,
    fullname: 'Abishek Ghimire',
  };

  const { leaveRequest: leaves, revalidate: leavesRevalidate } =
    useLeaveRequest(params);
  console.log(leaves);

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

  const onReviewClick = (record) => {
    const newRecord = {
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
    };
    form.setFieldsValue(newRecord);
    setAction('review');
    openModal();
  };

  const onEditClick = (record) => {
    const newRecord = {
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
    };
    setEditingData(newRecord);
    form.setFieldsValue(newRecord);
    setAction('edit');
    openModal();
  };

  const onDeleteClick = (record) => {
    deleteLeaves(record.id);
    leavesRevalidate();
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);
    const myValues = {
      ...values,
      userId: 8,
      isApproved: false,
      organisationId: 1,
      isArchived: false,
      rejectionReason: 'hi',
      transferShiftTo: 2,
      createdBy: 4,
    };
    try {
      if (action === 'edit') {
        await updateLeaves(editingData.id, values);
      } else {
        await createLeaves(myValues);
      }
      leavesRevalidate();
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
      setIsModalVisible(false);
    }
  };

  const onDecisionChange = (value) => {
    setDecision(value);
    if (value === 'rejected') {
      setTransfer(null);
    }
  };

  const onAllDayChange = () => {
    setIsAllDay(!isAllDay);
  };

  const getTitle = () => {
    if (action === 'add') {
      return 'Apply for Leave';
    } else if (action === 'accept-reject') {
      return 'Accept / Reject Leave';
    } else if (action === 'review') {
      return 'Review Leave Request';
    } else if (action === 'edit') {
      return 'Edit Leave Request';
    }
  };

  const columns = [
    ...(!isMyLeave
      ? [
          {
            title: 'Teacher / Staff Member Name',
            dataIndex: 'name',
            key: 'name',
            render: () => loggedInUser.fullname,
            responsive: ['lg'],
          },
        ]
      : []),

    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: (text) => moment(text).format('DD/MM/YYYY'),

      key: 'startDate',
      responsive: ['md'],
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      render: (text) => moment(text).format('DD/MM/YYYY'),
      key: 'endDate',
      responsive: ['md'],
    },

    {
      title: 'Request Type',
      dataIndex: 'requestType',
      key: 'requestType',
      responsive: ['lg'],
    },
    {
      title: 'Decided At',
      dataIndex: 'decidedAt',
      key: 'decidedAt',
      render: (_, leaveRequest) => {
        if (leaveRequest.decidedAt == null) {
          return '-';
        } else {
          return leaveRequest.decidedAt;
        }
      },
      responsive: ['sm'],
    },
    {
      title: 'Decided By',
      dataIndex: 'decidedBy',
      key: 'decidedBy',
      render: (_, leaveRequest) => {
        if (leaveRequest.decidedBy == null) {
          return '-';
        } else {
          return leaveRequest.decidedBy;
        }
      },
      responsive: ['sm'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, leaveRequest) => {
        if (leaveRequest.isApproved == true) {
          return 'Approved';
        } else if (leaveRequest.isApproved == false) {
          return 'Rejected';
        } else {
          return 'Pending';
        }
      },
      responsive: ['sm'],
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) =>
        screens.md ? (
          <Space size="middle">
            <Button
              type="link"
              icon={<Eye />}
              onClick={() => onReviewClick(record)}
            />
            <Button
              type="link"
              icon={<FilePenLine />}
              onClick={() => onEditClick(record)}
              disabled={record.status !== 'Pending'}
            />
            {isMyLeave && (
              <>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this request?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onDeleteClick(record)}
                >
                  <Button
                    type="link"
                    danger
                    icon={<Trash2Icon stroke="red" />}
                  />
                </Popconfirm>
              </>
            )}
            {!isMyLeave && (
              <Flex wrap className="site-button-ghost-wrapper ">
                <Button
                  type="primary"
                  danger
                  ghost
                  size="medium"
                  onClick={() => onAcceptRejectClick(record)}
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
                  { key: 'view', label: 'View', icon: <Eye /> },
                  { key: 'edit', label: 'Edit', icon: <FilePenLine /> },
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
          <p className="text-xl font-bold">
            {isMyLeave
              ? 'My Leave'
              : isAllLeave
              ? 'All Leave'
              : "My Team's Leave"}
          </p>
          <Button type="primary" onClick={onAddClick}>
            Add New
          </Button>
        </div>
        {!isMyLeave && (
          <Space>
            <Space direction="vertical" style={{ marginBottom: 16 }}>
              <p>Filter By</p>
              <Select
                showSearch
                placeholder="Teacher / Staff Member"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: '1', label: 'Jack' },
                  { value: '2', label: 'Lucy' },
                  { value: '3', label: 'Tom' },
                ]}
                style={{ width: 300 }}
              />
            </Space>

            <Space
              direction="vertical"
              style={{ width: '200px', marginLeft: 16, marginBottom: 16 }}
            >
              <p>Status</p>
              <Select
                showSearch
                placeholder="Status"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: '1', label: 'Pending' },
                  { value: '2', label: 'Approved' },
                  { value: '3', label: 'Rejected' },
                ]}
                style={{ width: '100%' }}
              />
            </Space>
          </Space>
        )}

        <Table
          columns={columns}
          dataSource={Array.isArray(leaves) ? leaves : []}
          pagination={{
            pageSizeOptions: ['10', '20', '50'],
            showSizeChanger: true,
            responsive: true,
          }}
          rowKey={(record) => record.id}
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
          confirmLoading={isProcessing}
          footer={
            action === 'add' ? (
              <>
                <Divider />
                <Button className="mr-2" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Apply
                </Button>
              </>
            ) : action === 'edit' ? (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Update
                </Button>
              </>
            ) : (
              []
            )
          }
        >
          <Form
            layout="vertical"
            disabled={action === 'review'}
            form={form}
            onFinish={onSubmit}
          >
            {action === 'accept-reject' && (
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Logged Date/Time"
                    initialValue={moment()} // Set the initialValue to moment()
                  >
                    <DatePicker
                      showTime
                      disabled
                      format="DD/MM/YYYY "
                      value={moment()}
                    />
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
                    <Select.Option value="sick leave">John Doe</Select.Option>
                    <Select.Option value="casual leave">Jane Doe</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}

            <Col>
              <Form.Item
                name="requestType"
                label="Request Type"
                rules={[{ required: true }]}
                width="100%"
                initialValue={action === 'review' ? data.leaveType : ''}
              >
                <Select>
                  <Select.Option value="sick leave">Sick Leave</Select.Option>
                  <Select.Option value="casual leave">
                    Casual Leave
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Form.Item name="isAllDay">
              <p style={{ marginBottom: '5px' }}>All Day?</p>
              <Switch checked={isAllDay} onChange={onAllDayChange} />
            </Form.Item>
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="From"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    showTime
                    format="DD/MM/YYYY"
                    ranges={dateRanges}
                    disabled={isAllDay || action === 'review'}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="To"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    showTime
                    format="DD/MM/YYYY"
                    ranges={dateRanges}
                    disabled={isAllDay || action === 'review'}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="note" label="Note to Approver">
              <Input.TextArea rows={4} />
            </Form.Item>
            {action === 'accept-reject' && (
              <>
                <Form.Item
                  name="decision"
                  label="Decision"
                  rules={[{ required: true }]}
                >
                  <Select onChange={onDecisionChange}>
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
          </Form>
        </Modal>
      </div>
    </Content>
  );
};

export default LeaveRequest;
