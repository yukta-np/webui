// app/students/StudentForm.jsx


import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Typography,
} from 'antd';
import moment from 'moment';

const { Item } = Form;
const { Option } = Select;
const { Title } = Typography;

const StudentForm = ({ initialValues, onFinish, mode = 'edit' }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const processedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      enrollmentDate: values.enrollmentDate?.format('YYYY-MM-DD'),
      graduationDate: values.graduationDate?.format('YYYY-MM-DD'),
    };

    if (onFinish) {
      onFinish(processedValues);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        dateOfBirth: initialValues?.dateOfBirth
          ? moment(initialValues.dateOfBirth)
          : null,
        enrollmentDate: initialValues?.enrollmentDate
          ? moment(initialValues.enrollmentDate)
          : null,
        graduationDate: initialValues?.graduationDate
          ? moment(initialValues.graduationDate)
          : null,
      }}
      onFinish={handleSubmit}
      id="student-form"
    >
      <Title level={4} className="mb-6">
        Personal Information
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="middleName" label="Middle Name">
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Item
            name="email"
            label="Email"
            rules={[{ type: 'email', required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={12}>
          <Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabled={mode === 'view'}
            />
          </Item>
        </Col>
        <Col span={8}>
          <Item
            name="nationality"
            label="Nationality"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="address" label="Address" rules={[{ required: true }]}>
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Academic Information
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="facultyId"
            label="Faculty ID"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="faculty" label="Faculty" rules={[{ required: true }]}>
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="program" label="Program" rules={[{ required: true }]}>
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="batchNumber"
            label="Batch Number"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item
            name="enrollmentDate"
            label="Enrollment Date"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabled={mode === 'view'}
            />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="graduationDate" label="Graduation Date">
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabled={mode === 'view'}
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Financial Information
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="dueAmount"
            label="Due Amount"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item
            name="scholarshipStatus"
            label="Scholarship Status"
            valuePropName="checked"
          >
            <Checkbox disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Additional Information
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="isCr"
            label="Class Representative"
            valuePropName="checked"
          >
            <Checkbox disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="isActive" label="Active Status" valuePropName="checked">
            <Checkbox disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="avatar" label="Avatar URL">
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Guardian Information
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="guardianUserId"
            label="Guardian User ID"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item
            name="guardianName"
            label="Guardian Name"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item
            name="guardianContact"
            label="Guardian Contact"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Item
            name="emergencyContact"
            label="Emergency Contact"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === 'view'} />
          </Item>
        </Col>
        <Col span={8}>
          <Item name="userId" label="User ID" rules={[{ required: true }]}>
            <InputNumber className="w-full" disabled={mode === 'view'} />
          </Item>
        </Col>
      </Row>
    </Form>
  );
};

export default StudentForm;
