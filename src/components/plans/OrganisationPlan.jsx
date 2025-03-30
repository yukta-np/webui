import React, { useState } from 'react';
import {
  Form,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Space,
  Row,
  Col,
  Tag,
} from 'antd';
import { FilePenLine, X, Save } from 'lucide-react';

const { Option } = Select;

const OrganisationPlan = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [planData, setPlanData] = useState({
    planName: 'Premium',
    startDate: null,
    endDate: null,
    status: true,
    price: 49.99,
    admins: 5,
    managers: 10,
    teachers: 50,
    students: 500,
    storage: 100,
  });

  const planOptions = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Enterprise', label: 'Enterprise' },
  ];

  const onSave = () => {
    form
      .validateFields()
      .then((values) => {
        setPlanData(values);
        setEditing(false);
      })
      .catch((err) => console.log('Validation failed:', err));
  };

  const onEdit = () => {
    setEditing(true);
  };

  const onCancel = () => {
    form.resetFields();
    setEditing(false);
  };

  return (
    <div className="p-4 ml-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Plan Details</h1>
          <Form.Item name="status" valuePropName="checked" noStyle>
            <Tag color={planData.status ? 'green' : 'red'}>
              {planData.status ? 'Active' : 'Inactive'}
            </Tag>
          </Form.Item>
        </div>
        {!editing ? (
          <Button
            type="primary"
            icon={<FilePenLine size={18} className="mt-1" />}
            onClick={onEdit}
          >
            Edit
          </Button>
        ) : (
          <Space>
            <Button icon={<X size={18} className=" mt-1" />} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<Save size={18} className="mt-1" />}
              onClick={onSave}
            >
              Save
            </Button>
          </Space>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={planData}
        disabled={!editing}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="planName"
              label="Plan Name"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select a plan">
                {planOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="price"
              label="Price ($)"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                formatter={(value) => `$ ${value}`}
                parser={(value) => value.replace(/\$\s?/, '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="startDate"
                  label="Start Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="endDate"
                  label="End Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="storage"
              label="Storage (GB)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="admins"
              label="Admins"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="managers"
              label="Managers"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="teachers"
              label="Teachers"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="students"
              label="Students"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default OrganisationPlan;
