import React, { useState, useEffect, useContext } from 'react';
import {
  Skeleton,
  Table,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Space,
  Popconfirm,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import useSWR, { mutate } from 'swr';
import { constants, headers } from '../../constants';
import Link from 'next/link';
import { SearchOutlined } from '@ant-design/icons';
import { Roles, fetcher, openNotification } from '../../utils';
import { useAppContext } from '../../app-context';
import { AbilityContext } from '@/utils/can';

const PermissionGroupList = () => {
  const { loggedInUser } = useAppContext();
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);

  const [meta, setMeta] = useState({});
  const [action, setAction] = useState('add');
  const [id, setId] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [staffUsers, setStaffUsers] = useState([]);
  const [groupStatus, setGroupStatus] = useState('open');
  const [searchedColumn, setSearchedColumn] = useState(null);
  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const ability = useContext(AbilityContext);

  let searchInput = null;

  const url = `${constants.urls.permissionGroupUrl}`;

  let { data: responseData } = useSWR(url, fetcher);

  let { data: usersData } = useSWR(
    `${constants.urls.usersUrl}?role[]=${Roles.ADMIN}&role[]=${Roles.MANAGER}`,
    fetcher
  );

  useEffect(() => {
    if (responseData) {
      setGroups(responseData.data);
      setMeta(responseData.meta);
    }
  }, [responseData]);

  useEffect(() => {
    if (usersData) {
      setStaffUsers(usersData.data);
    }
  }, [usersData]);

  useEffect(() => {
    fetchData();
  }, [selectedUsers]);

  useEffect(() => {
    fetchData();
  }, [groupStatus]);


  const onDeleteClick = async (id) => {
    try {
      await axios.delete(`${constants.urls.permissionGroupUrl}/${id}`, {
        headers,
      });
      mutate(url);
      openNotification('Row has been deleted.');
    } catch (e) {
      openNotification('Something broke.', true);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    const term = selectedKeys[0] || '';
    setSearchText(term);
    setSearchedColumn(dataIndex);
    // confirm();
    fetchData({ term });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
    setTimeout(() => {
      fetchData({ term: '' });
    }, 100);
  };

  const onAddClick = () => {
    setAction('add');
    form.resetFields();
    showModal();
  };

  const fetchData = async (params = {}) => {
    const { data: responseData } = await axios.get(
      constants.urls.permissionGroupUrl,
      {
        params,
        headers,
      }
    );

    const { data, meta } = responseData;

    setGroups(data);
    setMeta(meta);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '';
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) => text,
  });

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      ...getColumnSearchProps('name'),
      render: (text, row) => (
        <Link href={`/permission-groups/${row.id}/edit`}>{text}</Link>
      ),
    },
    {
      title: 'Creation Date/Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm a'),
    },
    ...(loggedInUser?.role === Roles.ADMIN ||
    loggedInUser?.permissions?.permissionGroup?.update === true ||
    loggedInUser?.permissions?.permissionGroup?.delete === true
      ? [
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space size="middle">
                {(loggedInUser?.role === Roles.ADMIN ||
                  loggedInUser.permissions?.permissionGroup?.update ===
                    true) && (
                  <Link href={`/permission-groups/${record.id}/edit`}>
                    Edit
                  </Link>
                )}
                {(loggedInUser?.role === Roles.ADMIN ||
                  loggedInUser.permissions?.permissionGroup?.delete ===
                    true) && (
                  <Popconfirm
                    title="Are you sure to delete?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onDeleteClick(record.id)}
                  >
                    <a href="#">Delete</a>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]
      : []),
  ];

  const onSubmit = async (values) => {
    const fieldsToSubmit = {
      name: values.name,
    };

    let axiosRequest;
    let url;
    if (action === 'add') {
      axiosRequest = axios.post;
      url = constants.urls.permissionGroupUrl;
    } else {
      axiosRequest = axios.put;
      url = `${constants.urls.permissionGroupUrl}/${id}`;
    }

    try {
      await axiosRequest(url, fieldsToSubmit, {
        headers,
      });
      hideModal();
      openNotification(`Successfully ${action}ed.`);
      mutate(constants.urls.permissionGroupUrl);
      form.resetFields();
    } catch (e) {
      if (e.response && e.response.data) {
        setAlertMessage(e.response.data.message);
      }
      console.error(e);
    }
  };

  const onTableChange = async (pagination, filters, sorter) => {
    const options = {
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      sort: sorter.order === 'descend' ? `-${sorter.field}` : sorter.field,
      ...filters,
    };

    await fetchData(options);
  };

  const onAvatarSelect = async (id) => {
    const selUsers = selectedUsers.includes(id)
      ? selectedUsers.filter((s) => s !== id)
      : [...selectedUsers, id];
    setSelectedUsers(selUsers);
  };

  const onGroupStatusChange = async (groupStatus) => {
    setGroupStatus(groupStatus);
  };

  return groups ? (
    <>
      <div className="p-4">
        <Row gutter={16}>
          <Col span={21}>
            <Row gutter={16}>
              <Col span={6}>
                <Typography.Title level={3} className="thin">
                  Permission Groups
                </Typography.Title>
              </Col>
            </Row>
          </Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            {(loggedInUser?.role === Roles.ORGADMIN ||
              loggedInUser?.permissions?.permissionGroup?.create === true) && (
              <Button type="primary" href="/permission-groups/new">
                Add New
              </Button>
            )}
          </Col>
        </Row>
        <br />
        <Table
          size={'middle'}
          rowKey={(record) => record.id}
          dataSource={groups}
          columns={columns}
          onChange={onTableChange}
          pagination={{
            total: meta.totalRows,
            pageSize: meta.limit,
          }}
        />
      </div>
    </>
  ) : (
    <div>
      <Skeleton active key={1} />
      <Skeleton active key={2} />
      <Skeleton active key={3} />
      <Skeleton active key={4} />
    </div>
  );
};

export default PermissionGroupList;
