// app/students/page.jsx
import React, { useState, useEffect, use } from 'react';
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
} from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FilePenLine, Trash2Icon, PlusCircle } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { deleteStudent } from '@/services/students.http';
import { openNotification } from '@/utils';


const { Title, Text } = Typography;

const StudentListPage = () => {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterForm] = Form.useForm();



  const {students, meta, loading} = useStudents()
  const onDelete = async (id) => {
    try {
      await deleteStudent(id);
      openNotification('Student deleted successfully');
    } catch (error) {
      message.error('Failed to delete student');
      console.error('Error deleting student:', error);
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
            onClick={() => router.push(`/students/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            onClick={() => router.push(`/students/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete student"
            description="Are you sure to delete this student?"
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
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={students}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

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