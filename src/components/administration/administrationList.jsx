// app/administration/page.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Typography,
  Breadcrumb,
  Drawer,
  Form,
  Input,
  Card,
  Row,
  Col,
  Divider,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FilePenLine, Trash2Icon, PlusCircle } from 'lucide-react';
import { useAdministration } from '@/hooks/useAdministration';
import { deleteAdministration } from '@/services/administration.http';
import { openNotification } from '@/utils';

const { Title, Text } = Typography;

const AdministrationList = () => {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterForm] = Form.useForm();

  const { administration, meta, loading } = useAdministration();

  const onDelete = async (id) => {
    try {
      await deleteAdministration(id);
      openNotification('Administration staff deleted successfully');
    } catch (error) {
      message.error('Failed to delete staff member');
      console.error('Error deleting administration:', error);
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
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Position',
      dataIndex: 'isTeacher',
      key: 'position',
      render: (isTeacher) => (
        <Tag color={isTeacher ? 'blue' : 'geekblue'}>
          {isTeacher ? 'Teacher' : 'Administrator'}
        </Tag>
      ),
    },
    {
      title: 'Qualification',
      dataIndex: 'highestQualification',
      key: 'highestQualification',
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'volcano'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => router.push(`/administration/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            onClick={() => router.push(`/administration/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete staff member"
            description="Are you sure to delete this record?"
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

  // const filteredData = administration.filter((item) => {
  //   return Object.entries(filterValues).every(([key, value]) => {
  //     if (!value) return true;
  //     return String(item[key]).toLowerCase().includes(value.toLowerCase());
  //   });
  // });

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Administration</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={3} className="mb-1">
              Administration Management
            </Title>
            <Text type="secondary">Manage staff members and records</Text>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setFilterDrawerVisible(true)}>Filter</Button>
            <Button
              type="primary"
              onClick={() => router.push('/administration/new')}
            >
              Add New
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
          dataSource={administration}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

      <Drawer
        title="Filter Administration"
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
          <Form.Item name="highestQualification" label="Qualification">
            <Input placeholder="Search qualification" />
          </Form.Item>
          <Form.Item name="specialization" label="Specialization">
            <Input placeholder="Search specialization" />
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

export default AdministrationList;
