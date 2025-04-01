import React, { useState, useRef } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Divider,
} from 'antd';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';

const FacultyList = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState([
    {
      key: 'FAC-1',
      name: 'Faculty of Engineering',
      shortName: 'FOE',
      university: 'University of Colombo',
    },
    {
      key: 'FAC-2',
      name: 'Faculty of Medicine',
      shortName: 'FOM',
      university: 'University of Peradeniya',
    },
  ]);

  // Sample universities data
  const universities = [
    { value: 'University of Colombo', label: 'University of Colombo' },
    { value: 'University of Peradeniya', label: 'University of Peradeniya' },
    { value: 'University of Moratuwa', label: 'University of Moratuwa' },
    { value: 'University of Kelaniya', label: 'University of Kelaniya' },
  ];

  const onSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const onReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => onSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => onSearch(selectedKeys, confirm, dataIndex)}
            icon={<Search size={14} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => onReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <Search style={{ color: filtered ? '#1890ff' : undefined }} size={14} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      render: (text, record) => (
        <a className="text-blue-600" onClick={() => onView(record)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Faculty Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      key: 'shortName',
    },
    {
      title: 'University',
      dataIndex: 'university',
      key: 'university',
      ...getColumnSearchProps('university'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FilePenLine size={18} />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete this faculty?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record)}
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setIsModalVisible(false);
    setEditingFaculty(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log(values);
    setIsModalVisible(false);
    setEditingFaculty(null);
    form.resetFields();
  };

  const onEdit = (record) => {
    form.setFieldsValue(record);
    setEditingFaculty(record);
    setIsModalVisible(true);
  };

  const onView = (record) => {
    form.setFieldsValue(record);
    setEditingFaculty(record);
    setIsModalVisible(true);
  };

  const onDelete = (record) => {
    console.log('deleted');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold m-0">Faculties</p>
        <Button type="primary" onClick={showModal}>
          Add New
        </Button>
      </div>{' '}
      <div className="mb-4 flex justify-end"></div>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
        visible={isModalVisible}
        onCancel={onCancel}
        onOk={() => form.submit()}
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Faculty Name"
            name="name"
            rules={[{ required: true, message: 'Please input faculty name!' }]}
          >
            <Input placeholder="Enter faculty name" />
          </Form.Item>

          <Form.Item
            label="Short Name"
            name="shortName"
            rules={[
              { required: true, message: 'Please input short name!' },
              { max: 10, message: 'Short name must be maximum 10 characters!' },
            ]}
          >
            <Input placeholder="Enter short name" />
          </Form.Item>

          <Form.Item
            label="University"
            name="university"
            rules={[{ required: true, message: 'Please select university!' }]}
          >
            <Select
              showSearch
              placeholder="Select university"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {universities.map((univ) => (
                <Select.Option key={univ.value} value={univ.value}>
                  {univ.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FacultyList;
