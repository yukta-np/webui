// app/staff/page.jsx
import React, { useState } from 'react';
import {
  Table,
  Button,
  Typography,
  Drawer,
  Form,
  Input,
  Row,
  Col,
  Divider,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2Icon, PlusCircle } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { deleteStaff } from '@/services/staff.http';
import { openNotification } from '@/utils';
import moment from 'moment';

const { Title, Text } = Typography;

const StaffListPage = () => {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterForm] = Form.useForm();

  const { staff, meta, loading } = useStaff();

  const onDelete = async (id) => {
    try {
      await deleteStaff(id);
      openNotification('Staff deleted successfully');
    } catch (error) {
      message.error('Failed to delete staff');
      console.error('Error deleting staff:', error);
    }
  };

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
    {
      title: 'Role',
      key: 'role',
      render: (_, record) => (
        <Tag color={record.isTeacher ? 'blue' : 'geekblue'}>
          {record.isTeacher ? 'Teacher' : 'Staff'}
        </Tag>
      ),
    },
    {
      title: 'Faculty ID',
      dataIndex: 'facultyId',
      key: 'facultyId',
      sorter: (a, b) => a.facultyId - b.facultyId,
    },
    {
      title: 'Academic Program',
      dataIndex: 'academicProgram',
      key: 'academicProgram',
      sorter: (a, b) => a.academicProgram - b.academicProgram,
    },
    {
      title: 'Hire Date',
      key: 'hireDate',
      render: (_, record) => moment(record.hireDate).format('YYYY-MM-DD'),
      sorter: (a, b) => new Date(a.hireDate) - new Date(b.hireDate),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (value) => `NRs ${value?.toLocaleString()}`,
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button>
            <Link href={`/staff/${record.id}/view`}>View</Link>
          </Button>
          <Button
            type="link"
            onClick={() => router.push(`/staff/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete staff"
            description="Are you sure to delete this staff member?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="link" danger icon={<Trash2Icon size={16} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onFilter = (values) => {
    setFilterValues(values);
    setFilterDrawerVisible(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">
            Staff Management
          </Title>
          <Text type="secondary">
            Manage staff records and employment information
          </Text>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setFilterDrawerVisible(true)}>Filter</Button>
          <Button type="primary" onClick={() => router.push('/staff/new')}>
            Add Staff
          </Button>
        </div>
      </div>

      <Table
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={staff}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Drawer
        title="Filter Staff"
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
          <Form.Item name="facultyId" label="Faculty ID">
            <Input type="number" placeholder="Search faculty ID" />
          </Form.Item>
          <Form.Item name="academicProgram" label="Academic Program">
            <Input type="number" placeholder="Search academic program" />
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

export default StaffListPage;
