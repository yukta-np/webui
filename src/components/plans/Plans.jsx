import React, { useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Input,
  Modal,
  Form,
  InputNumber,
  Switch,
  DatePicker,
  Select,
  Divider,
  theme,
  Breadcrumb,
  Grid,
  Layout,
} from 'antd';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const Plans = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const plansData = [
    {
      key: '1',
      name: 'Basic Plan',
      price: 'Rs.10000/month',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      createdAt: '2022-11-15 10:30',
      admins: 2,
      managers: 1,
      teachers: 3,
      students: 50,
      storage: 2,
    },
    {
      key: '2',
      name: 'Premium Plan',
      price: 'Rs.5000/month',
      startDate: '2023-02-15',
      endDate: '2023-12-31',
      createdAt: '2022-12-20 14:45',
      admins: 3,
      managers: 2,
      teachers: 5,
      students: 100,
      storage: 5,
    },
    {
      key: '3',
      name: 'Trial Plan',
      price: 'Free',
      startDate: '2023-03-01',
      endDate: '2023-03-31',
      createdAt: '2023-02-28 09:15',
      admins: 1,
      managers: 1,
      teachers: 1,
      students: 10,
      storage: 1,
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log('New plan:', {
          ...values,
          startDate: values.startDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD'),
          status: values.active ? 'active' : 'inactive',
          createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
          price: `$${values.price}/month`,
          key: `${plansData.length + 1}`,
        });
        setIsModalOpen(false);
        // Here you would typically update your state or make an API call
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
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
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<Search size={14} />}
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
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <Search size={14} style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    sorter: (a, b) => a[dataIndex].localeCompare(b[dataIndex]),
    sortDirections: ['descend', 'ascend'],
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Admins',
      dataIndex: 'admins',
      key: 'admins',
    },

    {
      title: 'Managers',
      dataIndex: 'managers',
      key: 'managers',
    },
    {
      title: 'Teachers',
      dataIndex: 'teachers',
      key: 'teachers',
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: 'Storage (in Gbs)',
      dataIndex: 'storage',
      key: 'storage',
    },
    {
      title: 'Creation Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<FilePenLine size={18} />} />
          <Popconfirm
            title="Delete this plan?"
            description="Are you sure you want to delete this plan?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => console.log('Deleted', record.key)}
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
        <Breadcrumb.Item>Plans</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-bold">Plans</p>
          <Space>
            <Input.Search
              placeholder="Search plans..."
              allowClear
              enterButton
              style={{ width: 300 }}
              onSearch={(value) => setSearchText(value)}
            />
            <Button type="primary" onClick={showModal}>
              Add New
            </Button>
          </Space>
        </div>

        <Table
          size="small"
          columns={columns}
          dataSource={plansData.filter((item) =>
            Object.keys(item).some((key) =>
              item[key]
                ?.toString()
                .toLowerCase()
                .includes(searchText.toLowerCase())
            )
          )}
          bordered
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title="Create New Plan"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={500}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Create
            </Button>,
          ]}
        >
          <Divider />
          <Form form={form} layout="vertical" initialValues={{ active: true }}>
            <Form.Item
              name="name"
              label="Plan Name"
              rules={[
                { required: true, message: 'Please input the plan name!' },
              ]}
            >
              <Input placeholder="Enter plan name" />
            </Form.Item>

            <Form.Item
              name="admins"
              label="Number of Admins"
              rules={[
                { required: true, message: 'Please input number of admins' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="Enter number of admins"
              />
            </Form.Item>

            <Form.Item
              name="managers"
              label="Number of Managers"
              rules={[
                { required: true, message: 'Please input number of managers' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="Enter number of managers"
              />
            </Form.Item>

            <Form.Item
              name="teachers"
              label="Number of Teachers"
              rules={[
                { required: true, message: 'Please input number of teachers' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="Enter number of teachers"
              />
            </Form.Item>

            <Form.Item
              name="students"
              label="Number of Students"
              rules={[
                { required: true, message: 'Please input number of students' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="Enter number of students"
              />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price (NPR)"
              rules={[{ required: true, message: 'Please input the price!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={(value) =>
                  `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Form>
          <Divider />
        </Modal>
      </div>
    </Content>
  );
};

export default Plans;
