import React, { useState } from 'react';
import {
  Table,
  Space,
  Button,
  Popconfirm,
  Input,
  Modal,
  Form,
  InputNumber,
  Divider,
  Row,
  Col,
} from 'antd';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';
import { usePlanTemplate } from '@/hooks/usePlanTemplate';
import { Actions } from '@/constants';
import {
  getPlanById,
  deletePlan,
  updatePlan,
  createPlan,
} from '@/services/planTemplate.http';
import { openNotification } from '@/utils';
import moment from 'moment';

const Plans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [action, setAction] = useState(Actions.add);
  const [isProcessing, setIsProcessing] = useState(false);
  const [id, setId] = useState(null);
  const [searchInputs, setSearchInputs] = useState({
    name: '',
  });

  const { plans, isLoading, isError, revalidate } = usePlanTemplate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const populateFrom = (data) => {
    form.setFieldsValue(data);
  };

  const onAdd = () => {
    setAction(Actions.add);
    form.resetFields();
    showModal();
  };

  const onView = async (id) => {
    setAction(Actions.view);
    const { data } = await getPlanById(id);
    populateFrom(data);
    showModal();
  };

  const onEdit = async (id) => {
    setId(id);
    setAction(Actions.edit);
    const { data } = await getPlanById(id);
    populateFrom(data);
    showModal();
  };

  const onFinish = async (values) => {
    setIsProcessing(true);
    const myValues = {
      ...values,
    };
    try {
      action === Actions.add
        ? await createPlan(myValues)
        : await updatePlan(id, myValues);
      openNotification('Plan updated successfully');
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error updating plan', error);
      openNotification('Failed to update plan', true);
    } finally {
      setIsProcessing(false);
      revalidate();
    }
  };

  const onDelete = async (id) => {
    await deletePlan(id);
    openNotification('Plan deleted successfully');
    revalidate();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={searchInputs[dataIndex]}
          onChange={(e) => onSearch(dataIndex, e.target.value)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => onSearch(dataIndex, searchInputs[dataIndex])}
            icon={<Search size={14} />}
          >
            Search
          </Button>
          <Button size="small" onClick={() => onResetSearch(dataIndex)}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <Search size={14} style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  const filteredPlans = plans?.filter((plan) => {
    const fullName = `${plan.name} `.toLowerCase();
    const nameMatch = fullName.includes(searchInputs.name.toLowerCase());

    return nameMatch;
  });

  const onSearch = (key, value) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onResetSearch = (key) => {
    setSearchInputs((prev) => ({ ...prev, [key]: '' }));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      width: 80,
      render: (_, plans) => (
        <a className="text-blue-600" onClick={() => onView(plans?.id)}>
          {plans?.displayId}
        </a>
      ),
    },
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
      dataIndex: 'numOfAdmin',
      key: 'admins',
    },

    {
      title: 'Managers',
      dataIndex: 'numOfManager',
      key: 'managers',
    },
    {
      title: 'Teachers',
      dataIndex: 'numOfTeacher',
      key: 'teachers',
    },
    {
      title: 'Students',
      dataIndex: 'numOfStudent',
      key: 'students',
    },
    {
      title: 'Storage (in Gbs)',
      dataIndex: 'storageInGB',
      key: 'storage',
    },
    {
      title: 'Creation Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => <a>{moment(text).format('YYYY-MM-DD')}</a>,
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FilePenLine size={18} />}
            onClick={() => onEdit(record.id)}
          />
          <Popconfirm
            title="Are you sure to delete this plan?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="link" danger icon={<Trash2Icon size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Plans</p>
        <Space>
          <Input
            placeholder="Search name or email..."
            prefix={<Search size={18} />}
            style={{ width: 300 }}
            allowClear
            value={searchInputs.name}
            onChange={(e) => onSearch('name', e.target.value)}
          />
          <Button type="primary" onClick={onAdd}>
            Add New
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPlans}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={
          action === Actions.view
            ? 'Plan Details'
            : action === Actions.add
            ? 'Add Plan'
            : 'Edit Plan'
        }
        open={isModalOpen}
        onCancel={closeModal}
        width={500}
        footer={
          action === Actions.view ? (
            <Button key="back" onClick={closeModal}>
              Cancel
            </Button>
          ) : (
            [
              <Button key="back" onClick={closeModal}>
                Cancel
              </Button>,

              <Button key="submit" type="primary" onClick={() => form.submit()}>
                {action === Actions.add ? 'Add' : 'Save'}
              </Button>,
            ]
          )
        }
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={action === Actions.view}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Plan Name"
                rules={[
                  { required: true, message: 'Please input the plan name!' },
                ]}
              >
                <Input placeholder="Enter plan name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="numOfAdmin"
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="numOfManager"
                label="Number of Managers"
                rules={[
                  {
                    required: true,
                    message: 'Please input number of managers',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter number of managers"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="numOfTeacher"
                label="Number of Teachers"
                rules={[
                  {
                    required: true,
                    message: 'Please input number of teachers',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter number of teachers"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numOfStaff"
                label="Number of Staff"
                rules={[
                  { required: true, message: 'Please input number of staff' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter number of staff"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="numOfStudent"
                label="Number of Students"
                rules={[
                  {
                    required: true,
                    message: 'Please input number of students',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter number of students"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numOfParent"
                label="Number of Parents"
                rules={[
                  { required: true, message: 'Please input number of parents' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter number of parents"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="storageInGB"
                label="Storage (in GB)"
                rules={[
                  { required: true, message: 'Please input stroage in GB' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter storage in GB"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="durationInMonths"
                label="Duration (in months)"
                rules={[{ required: true, message: 'Please input duration' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter duration in months"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="price"
            label="Price (NPR)"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Enter price"
            />
          </Form.Item>
        </Form>
        <Divider />
      </Modal>
    </>
  );
};

export default Plans;
