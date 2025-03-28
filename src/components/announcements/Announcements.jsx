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
  Upload,
  Drawer,
  Typography,
} from 'antd';
import Link from 'next/link';
import { FilePenLine, Handshake, Trash2Icon } from 'lucide-react';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { useGroups } from '@/hooks/useGroup';
import { useUsers } from '@/hooks/useUsers';
import {
  Actions,
  constants,
  headers,
  ResourceActions,
  Resources,
} from '@/constants';
import { dateRanges, objectHasValue, openNotification } from '@/utils';
import axios from 'axios';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  updateAnnouncement,
} from '@/services/announcments.http';
import CanIDo from '@/utils/can';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const Announcements = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [shareToEveryone, setShareToEveryone] = useState(true);
  const [action, setAction] = useState('add');
  const [isProcessing, setIsProcessing] = useState(false);
  const [value, setValue] = useState();
  const [createdBy, setCreatedBy] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tablePage, setTablePage] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);

  const { groups, isLoading: groupsLoading } = useGroups();
  const { users, isLoading: usersLoading } = useUsers();

  const showDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);
  let params = {};

  if (objectHasValue(tablePage)) {
    params.limit = tablePage.limit;
    params.offset = tablePage.offset;
    if (tablePage.sort) {
      params.sort = tablePage.sort;
    }
  }

  if (createdBy) {
    params.createdBy = createdBy;
  }

  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const { announcements, meta, revalidate } = useAnnouncement(params);

  const populateForm = (data) => {
    const allowedUserIds =
      data.announcementUsers
        ?.filter((user) => user.allowDenyStatus === 'allow')
        ?.map((user) => user.id) || [];

    const deniedUserIds =
      data.announcementUsers
        ?.filter((user) => user.allowDenyStatus === 'deny')
        ?.map((user) => user.id) || [];

    const allowedGroupIds =
      data.announcementGroups
        ?.filter((group) => group.allowDenyStatus === 'allow')
        ?.map((group) => group.id) || [];

    const deniedGroupIds =
      data.announcementGroups
        ?.filter((group) => group.allowDenyStatus === 'deny')
        ?.map((group) => group.id) || [];

    const initialValues = {
      ...data,
      dueDate: data.dueDate ? moment(data.dueDate) : null,
      everyone: data.everyone,
      allowedGroupIds,
      deniedUserIds,
      allowedUserIds,
      deniedGroupIds,
    };
    form.setFieldsValue(initialValues);
    setIsModalVisible(true);
  };

  const onEdit = async (id) => {
    setAction(Actions.edit);
    setId(id);
    const { data } = await getAnnouncement(id);
    populateForm(data);
  };

  const onAdd = () => {
    setAction(Actions.add);
    setId(null);
    form.resetFields();
    showModal();
  };

  const onView = async (id) => {
    setAction(Actions.view);
    setId(id);
    const { data } = await getAnnouncement(id);
    populateForm(data);
  };

  const onDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      openNotification('Announcement deleted successfully');
      revalidate();
    } catch (error) {
      openNotification('Failed to delete announcement', true);
      console.error('Delete failed:', error);
    }
  };

  const onFinish = async (values) => {
    setIsProcessing(true);
    try {
      const payload = {
        ...values,
        dueDate: values.dueDate ? moment(values.dueDate).toISOString() : null,
      };
      action === Actions.add
        ? createAnnouncement(payload)
        : updateAnnouncement(id, payload);
      openNotification(`Announcement ${action}ed successfully`);
      revalidate();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      openNotification(`Failed to ${action} announcement`, true);
      console.error('Submission error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '7%',
      render: (text, record) => (
        <a className="text-blue-600" onClick={() => onView(record.id)}>
          ANC-{text}
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
      width: '15%',
      render: (_, record) => record.creator?.fullName || 'N/A',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: '10%',
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '13%',
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm A'),
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
            onClick={() => onEdit(record.id)}
          />
          <Popconfirm
            title="Delete the announcement"
            description="Are you sure to delete this announcement?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="link" icon={<Trash2Icon stroke="red" size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filterByDateRange = (value) => {
    if (!value) {
      setStartDate(null);
      setEndDate(null);
      return;
    }
    const startDate = value[0];
    const endDate = value[1];
    const formattedStartDate = startDate
      ? startDate.format('YYYY-MM-DD')
      : null;
    const formattedEndDate = endDate ? endDate.format('YYYY-MM-DD') : null;
    params = {
      ...params,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    revalidate();
  };

  const filterByCreator = (value) => {
    setCreatedBy(value);
    revalidate();
  };

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
    const firstLetter =
      typeof label === 'string' ? label[0]?.toUpperCase() : '';

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

  const onTableChange = (pagination, filters, sorter) => {
    const options = {
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      sort: sorter.order === 'descend' ? `-${sorter.field}` : sorter.field,
      ...filters,
    };
    setTablePage(options);
  };

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Announcements</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="flex items-center justify-between">
          <Typography.Title level={3} className="thin">
            Announcements
          </Typography.Title>
          <div className="flex items-center gap-2 mb-2">
            <Button onClick={showDrawer} ghost type="primary">
              Filter
            </Button>
            <CanIDo
              action={ResourceActions.create}
              resource={Resources.announcements}
              showUnauthenticated={false}
            >
              <Button type="primary" onClick={onAdd}>
                Add New
              </Button>
            </CanIDo>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={announcements}
          pagination={{
            total: meta?.totalRows,
            pageSize: meta?.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            responsive: true,
          }}
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content' }}
          bordered
          onChange={onTableChange}
          size={screens.xs ? 'small' : 'middle'}
          style={{
            minWidth: screens.xs ? '100%' : 'auto',
            overflowX: 'auto',
          }}
        />
        <Drawer
          title="Filter Announcements"
          placement="right"
          onClose={closeDrawer}
          open={isDrawerOpen}
          width={400}
        >
          <Row gutter={24} className="gap-3 mb-3">
            <Col span={24}>
              <label>Filter Date Range</label>
              <DatePicker.RangePicker
                allowClear
                presets={dateRanges}
                format={'DD/MM/YYYY'}
                className="w-full mt-2"
                value={dateFilter}
                onChange={(value) => filterByDateRange(value)}
              />
            </Col>

            <Col span={24}>
              <label>Created By</label>
              <Select
                className="w-full mt-2"
                onChange={filterByCreator}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={users?.map((c) => ({
                  label: c.fullName,
                  value: c.id,
                }))}
              />
            </Col>

            <Col span={24} className="mt-3 ">
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={closeDrawer}
              >
                Apply Filters
              </Button>
              <CanIDo
                action={ResourceActions.downloadCsv}
                resource={Resources.assetAllocations}
                showUnauthenticated={false}
              >
                <Button
                  // onClick={onDownloadCSV}
                  loading={isLoading}
                  type="ghost"
                >
                  Download CSV
                </Button>
              </CanIDo>
            </Col>
          </Row>
        </Drawer>
        <Modal
          title={`${
            action === 'add' ? 'Add' : action === 'edit' ? 'Edit' : 'View'
          } Announcement`}
          width={shareToEveryone ? 500 : 1000}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setAction(Actions.add); // Reset to default action
            setShareToEveryone(true);
          }}
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {action !== Actions.view && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Upload>
                    <Button icon={<UploadOutlined />} style={{ margin: 0 }}>
                      Upload
                    </Button>
                  </Upload>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {action === 'add' ? (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => setIsModalVisible(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="primary" onClick={() => form.submit()}>
                      Add
                    </Button>
                  </>
                ) : action === 'edit' ? (
                  <>
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
                  <Button onClick={() => setIsModalVisible(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            disabled={action === 'view'}
            onValuesChange={(changedValues) => {
              if ('everyone' in changedValues) {
                setShareToEveryone(changedValues.everyone);
              }
            }}
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
                      <Input placeholder="Enter announcement title" />
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
                      <Switch checked={shareToEveryone} defaultChecked />
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row gutter={24}>
                  <Col xs={24}>
                    <Form.Item
                      label="Select Documents"
                      name="selectedDocuments"
                    >
                      <Upload>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row> */}
              </div>

              {!shareToEveryone && (
                <>
                  <div className="pl-4 border-l border-gray-200">
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item
                          label="Share with Users"
                          name="allowedUserIds"
                        >
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
                        <Form.Item
                          label="Share with Groups"
                          name="allowedGroupIds"
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
                    <Row gutter={24}>
                      <Col xs={24}>
                        <Form.Item
                          label="User Black List (Don't share with these users)"
                          name="deniedUserIds"
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
                          name="deniedGroupIds"
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
