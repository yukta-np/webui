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
  Avatar,
} from 'antd';
import {
  EllipsisVertical,
  FilePenLine,
  Trash2Icon,
  Eye,
  CloudHail,
} from 'lucide-react';
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
import { useAppContext } from '@/app-context';
import { useUsers } from '@/hooks/useUsers';
import { useLeaveTypes } from '@/hooks/useLeaveTypes';
import { comment } from 'postcss';

const LeaveRequest = ({
  isAllLeave = false,
  isMyLeave = false,
  isMyTeamLeave = false,
}) => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState('add');
  const [decision, setDecision] = useState('');
  const [transfer, setTransfer] = useState(null);
  const [isForAllPeriods, setIsForAllPeriods] = useState(false);
  const [editingData, setEditingData] = useState(null);

  let params = {};

  const { loggedInUser } = useAppContext();

  const {
    leaveRequest: leaves,
    meta: leavesMeta,
    revalidate: leavesRevalidate,
  } = useLeaveRequest();
  const { users } = useUsers();
  const { leaveTypes } = useLeaveTypes();

  const leaveDecision = {
    approved: 'approved',
    rejected: 'rejected',
    pending: 'pending',
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onAddClick = () => {
    setAction('add');
    openModal();
  };

  const onAcceptRejectClick = (record) => {
    const { actionForOverlap, isApproved, ...deletedValue } = record;

    const newRecord = {
      ...deletedValue,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
      decidedAt: moment(),
      decidedBy: loggedInUser.userId,
      loggedBy: loggedInUser.fullName,
    };

    setEditingData(newRecord);
    form.setFieldsValue(newRecord);

    setAction('accept-reject');
    openModal();
  };

  const onReviewClick = (leaves) => {
    const record = {
      userId: leaves.assignee?.fullName,
      requestType: leaves.requestType,
      startDate: leaves.startDate ? moment(leaves.startDate) : null,
      endDate: leaves.endDate ? moment(leaves.endDate) : null,
      comments: leaves.comments,
      note: leaves.note,
      decidedAt: leaves.decidedAt ? moment(leaves.decidedAt) : null,
      decidedBy: leaves.decider?.fullName,
      reasonForRejection: leaves.reasonForRejection,
    };
    form.setFieldsValue(record);
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
    const { actionForOverlap, ...deletedValue } = values;
    const myValues = {
      ...deletedValue,
      userId: isMyLeave ? loggedInUser.userId : values.userId,
      organisationId: loggedInUser.orgId,
      isArchived: false,
      createdBy: loggedInUser.userId,
      isForAllPeriods: false,
      periodAllocations: [
        {
          periodName: 'Morning',
          allocatedUserId: null,
        },
      ],
    };

    const acceptRejectvalues = {
      ...values,
      periodAllocations: [
        {
          periodNames: 'M1',
          allocatedUserId: 2,
        },
      ],
      isApproved: decision === leaveDecision.approved ? true : false,
      decidedAt: values.decidedAt ? moment(values.decidedAt) : null,
      decidedBy: loggedInUser.userId,
    };

    try {
      if (action === 'edit') {
        await updateLeaves(editingData.id, values);
      } else if (action === 'accept-reject') {
        await updateLeaves(editingData.id, acceptRejectvalues);
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

    setTransfer(null);
  };

  const onAllPeriodsChange = () => {
    setIsForAllPeriods(!isAllPeriod);
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
            render: (_, leaves) => leaves?.assignee?.fullName,
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
          return moment(leaveRequest.decidedAt).format('DD/MM/YYYY hh:mm a');
        }
      },
      responsive: ['sm'],
    },
    {
      title: 'Decided By',
      dataIndex: 'decidedBy',
      key: 'decidedBy',
      render: (_, leaveRequest) => {
        if (leaveRequest.decidedAt == null) {
          return '-';
        }
        return leaveRequest?.decider?.fullName;
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
              icon={<Eye size={18} />}
              onClick={() => onReviewClick()}
            />
            <Button
              type="link"
              icon={<FilePenLine size={18} />}
              onClick={() => onEditClick(record)}
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
                    icon={<Trash2Icon stroke="red" size={18} />}
                  />
                </Popconfirm>
              </>
            )}
            {!isMyLeave && (
              <Flex wrap className="site-button-ghost-wrapper">
                <Button
                  type="primary"
                  ghost
                  danger
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
                  { key: 'view', label: 'View', icon: <Eye size={18} /> },
                  {
                    key: 'edit',
                    label: 'Edit',
                    icon: <FilePenLine size={18} />,
                  },
                  {
                    key: 'delete',
                    label: 'Delete',
                    icon: <Trash2Icon size={18} />,
                    danger: true,
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <Button icon={<EllipsisVertical size={18} />} />
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
                optionLabelProp="label"
                style={{ width: 300 }}
                placeholder="Teacher / Staff Member"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {users?.map((u) => (
                  <Option key={u.id} value={u.id} label={`${u.fullName}`}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar src={u?.avatar} style={{ marginRight: 8 }}>
                        {!u?.avatar && `${u?.fullName[0]}`}{' '}
                      </Avatar>
                      <span>{`${u.fullName}`}</span>
                    </div>
                  </Option>
                ))}
              </Select>
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
          dataSource={leaves}
          pagination={{
            ...leavesMeta,
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
            ) : action === 'accept-reject' ? (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Ok
                </Button>
              </>
            ) : (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
              </>
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
                  <Form.Item name="decidedAt" label="Logged Date/Time">
                    <DatePicker
                      showTime
                      format={'DD/MM/YYYY hh:mm A'}
                      disabled
                      value={moment()}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="loggedBy" label="Logged by">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {!isMyLeave && action !== 'accept-reject' && (
              <Col>
                <Form.Item
                  label="Teacher / Staff Member Name"
                  rules={[{ required: true }]}
                  width="100%"
                  name="userId"
                >
                  <Select optionLabelProp="label">
                    {users?.map((u) => (
                      <Option key={u.id} value={u.id} label={`${u.fullName}`}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar src={u?.avatar} style={{ marginRight: 8 }}>
                            {!u?.avatar && `${u?.fullName[0]}`}{' '}
                          </Avatar>
                          <span>{`${u.fullName}`}</span>
                        </div>
                      </Option>
                    ))}
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
                <Select
                  options={leaveTypes?.map((lt) => ({
                    label: lt.name,
                    value: lt.name,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Form.Item name="isForAllPeriods">
              <p style={{ marginBottom: '5px' }}>All Periods?</p>
              <Switch checked={isForAllPeriods} onChange={onAllPeriodsChange} />
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
                    disabled={isForAllPeriods || action === 'review'}
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
                    disabled={isForAllPeriods || action === 'review'}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="comments" label="Comments">
              <Input.TextArea
                rows={3}
                disabled={action === 'accept-reject' || action === 'review'}
              />
            </Form.Item>
            {!isMyLeave && action !== 'add' && (
              <>
                <Form.Item name="note" label="Note">
                  <Input.TextArea rows={3} />
                </Form.Item>
                {!isMyLeave && action === 'review' && (
                  <Row>
                    <Col span={12}>
                      <Form.Item name="decidedAt" label="Decided At">
                        <DatePicker
                          showTime
                          format={'DD/MM/YYYY hh:mm A'}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="decidedBy" label="Decided By">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {action !== 'review' && (
                  <Form.Item label="Decision" rules={[{ required: true }]}>
                    <Select
                      onChange={(value) => {
                        onDecisionChange(value);
                      }}
                    >
                      <Select.Option value={leaveDecision.approved}>
                        Approve
                      </Select.Option>
                      <Select.Option value={leaveDecision.rejected}>
                        Reject
                      </Select.Option>
                    </Select>
                  </Form.Item>
                )}
                {decision === leaveDecision.rejected && (
                  <Form.Item
                    name="rejectionReason"
                    label="Reason for Rejection"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                )}
                {decision === leaveDecision.approved && (
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
                {action === 'review' && (
                  <Form.Item
                    name="rejectionReason"
                    label="Reason for Rejection"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={4} />
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
