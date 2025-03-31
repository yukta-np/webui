import React, { useEffect } from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Typography,
  Alert,
  Button,
} from 'antd';
import moment from 'moment';
import { createStudent } from '@/services/students.http';
import { openNotification } from '@/utils';
import { emailRegex, phoneRegex } from '@/utils';

const { Item } = Form;
const { Title } = Typography;

const StudentForm = ({
  initialValues,
  mode = 'create',
  error,
  loading,
  onFinish,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
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
      });
    }
  }, [initialValues, form]);

  const onSubmit = async (values) => {
    console.log('Form values:', values);
    const processedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      enrollmentDate: values.enrollmentDate?.format('YYYY-MM-DD'),
      graduationDate: values.graduationDate?.format('YYYY-MM-DD'),
    };
    try {
      const response = await createStudent(processedValues);
      openNotification(
        'New Student Created Successfully! ID: ' + response.data.id);
    } catch (error) {
      console.error('Error creating student:', error);
      const errorMessage = error.response?.data?.message;
      openNotification(errorMessage || 'Error creating student', 'error');
      // Handle error (e.g., show a message to the user)
    }
  };

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish || onSubmit}
      id="student-form"
      initialValues={{
        isActive: true,
        scholarshipStatus: false,
        ...initialValues,
      }}
    >
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      <Title level={4} className="mb-6">
        Personal Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input disabled={isViewMode} placeholder="John" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item name="middleName" label="Middle Name">
            <Input disabled={isViewMode} placeholder="Michael" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input disabled={isViewMode} placeholder="Doe" />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { pattern: emailRegex, message: 'Invalid email format' },
            ]}
          >
            <Input
              disabled={isViewMode}
              type="email"
              placeholder="john.doe@example.com"
            />
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input phone number!' },
              { pattern: phoneRegex, message: 'Invalid phone number format' },
            ]}
          >
            <Input disabled={isViewMode} placeholder="+1234567890" />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[
              { required: true, message: 'Please select date of birth!' },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabled={isViewMode}
              disabledDate={(current) =>
                current && current > moment().endOf('day')
              }
            />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="nationality"
            label="Nationality"
            rules={[{ required: true, message: 'Please input nationality!' }]}
          >
            <Input disabled={isViewMode} placeholder="American" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input disabled={isViewMode} placeholder="123 Main Street" />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Academic Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="faculty"
            label="Faculty"
            // rules={[{ required: true, message: 'Please input faculty!' }]}
          >
            <Input disabled={isViewMode} placeholder="Computer Science" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="program"
            label="Program"
            // rules={[{ required: true, message: 'Please input program!' }]}
          >
            <Input disabled={isViewMode} placeholder="Bachelor's Degree" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="batchNumber"
            label="Batch Number"
            rules={[{ required: true, message: 'Please input batch number!' }]}
          >
            <Input disabled={isViewMode} placeholder="2023A" />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Item
            name="enrollmentDate"
            label="Enrollment Date"
            rules={[
              { required: true, message: 'Please select enrollment date!' },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabled={isViewMode}
            />
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item name="graduationDate" label="Graduation Date">
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabled={isViewMode}
              disabledDate={(current) =>
                current && current < form.getFieldValue('enrollmentDate')
              }
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Financial Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Item
            name="dueAmount"
            label="Due Amount ($)"
            rules={[{ required: true, message: 'Please input due amount!' }]}
          >
            <InputNumber
              className="w-full"
              disabled={isViewMode}
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item
            name="scholarshipStatus"
            label="Scholarship Status"
            valuePropName="checked"
          >
            <Checkbox disabled={isViewMode} />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Additional Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="isCr"
            label="Class Representative"
            valuePropName="checked"
          >
            <Checkbox disabled={isViewMode} />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item name="isActive" label="Active Status" valuePropName="checked">
            <Checkbox disabled={isViewMode || isCreateMode} />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="avatar"
            label="Avatar URL"
            rules={[{ type: 'url', message: 'Please enter valid URL' }]}
          >
            <Input
              disabled={isViewMode}
              placeholder="https://example.com/avatar.jpg"
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Guardian Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="guardianName"
            label="Guardian Name"
            rules={[{ required: true, message: 'Please input guardian name!' }]}
          >
            <Input disabled={isViewMode} placeholder="Jane Doe" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="guardianContact"
            label="Guardian Contact"
            rules={[
              { required: true, message: 'Please input guardian contact!' },
              { pattern: phoneRegex, message: 'Invalid phone number format' },
            ]}
          >
            <Input disabled={isViewMode} placeholder="+1987654321" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="emergencyContact"
            label="Emergency Contact"
            rules={[
              { required: true, message: 'Please input emergency contact!' },
              { pattern: phoneRegex, message: 'Invalid phone number format' },
            ]}
          >
            <Input disabled={isViewMode} placeholder="+1122334455" />
          </Item>
        </Col>
      </Row>

      {!isViewMode && (
        <div className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-32"
          >
            {isCreateMode ? 'Create Student' : 'Update Student'}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default StudentForm;
