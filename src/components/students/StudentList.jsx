// app/students/page.jsx


import React, { useState } from 'react';
import {
  Table,
  Button,
  Typography,
  Breadcrumb,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  Card,
  Row,
  Col,
  Divider,
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FilePenLine, Trash2Icon, PlusCircle } from 'lucide-react';

const { Title, Text } = Typography;

// Mock Data
const initialStudentData = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    faculty: 'BBA',
    program: 'Computer Science',
    startDate: '2023-08-15',
    phoneNumber: '+1234567890',
    dateOfBirth: '2000-01-01',
    nationality: 'American',
    address: '123 Main Street, City, Country',
    batchNumber: '2025A',
  },
  {
    key: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    faculty: 'Arts',
    program: 'English Literature',
    startDate: '2023-02-01',
    phoneNumber: '+1987654321',
    dateOfBirth: '2001-05-15',
    nationality: 'Canadian',
    address: '456 Oak Street, City, Country',
    batchNumber: '2025B',
  },
];

const StudentListPage = () => {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterForm] = Form.useForm();

  // Filter logic
  const filteredData = initialStudentData.filter((item) => {
    return Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      return String(item[key]).toLowerCase().includes(value.toLowerCase());
    });
  });

  // Column definitions
  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Faculty', dataIndex: 'faculty', key: 'faculty' },
    { title: 'Program', dataIndex: 'program', key: 'program' },
    { title: 'Batch', dataIndex: 'batchNumber', key: 'batchNumber' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => router.push(`/students/${record.key}`)}
          >
            View
          </Button>
          <Button
            type="link"
            onClick={() => router.push(`/students/${record.key}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete student"
            description="Are you sure to delete this student?"
            onConfirm={() => onDelete(record.key)}
          >
            <Button type="link" danger icon={<Trash2Icon size={16} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // onrs
  const onDelete = (key) => {
    // In real app, you would make API call here
    console.log('Deleted student with key:', key);
  };

  const onFilter = (values) => {
    setFilterValues(values);
    setFilterDrawerVisible(false);
  };

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Students</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={3} className="mb-1">
              Student Management
            </Title>
            <Text type="secondary">Manage student records and information</Text>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setFilterDrawerVisible(true)}>Filter</Button>
            <Button
              type="primary"
              icon={<PlusCircle size={16} />}
              onClick={() => router.push('/students/new')}
            >
              Add Student
            </Button>
          </div>
        </div>

        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

      {/* Filter Drawer */}
      <Drawer
        title="Filter Students"
        width={400}
        open={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        destroyOnClose
      >
        <Form form={filterForm} layout="vertical" onFinish={onFilter}>
          <Form.Item name="firstName" label="First Name">
            <Input placeholder="Search first name" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name">
            <Input placeholder="Search last name" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Search email" />
          </Form.Item>
          <Form.Item name="faculty" label="Faculty">
            <Input placeholder="Search faculty" />
          </Form.Item>
          <Form.Item name="program" label="Program">
            <Input placeholder="Search program" />
          </Form.Item>

          <Divider />
          <Row gutter={16}>
            <Col span={12}>
              <Button htmlType="submit" type="primary" block>
                Apply Filters
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                onClick={() => {
                  filterForm.resetFields();
                  setFilterValues({});
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default StudentListPage;
