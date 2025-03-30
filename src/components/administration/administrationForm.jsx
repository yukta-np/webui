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
import { createAdministration } from '@/services/administrations.http'; // Update this import to your actual service
import { openNotification } from '@/utils';
import { emailRegex, phoneRegex } from '@/utils';

const { Item } = Form;
const { Title } = Typography;

const AdministrationForm = ({
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
        hireDate: initialValues?.hireDate
          ? moment(initialValues.hireDate)
          : null,
      });
    }
  }, [initialValues, form]);

  const onSubmit = async (values) => {
    const processedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      hireDate: values.hireDate?.format('YYYY-MM-DD'),
    };
    try {
      const response = await createAdministration(processedValues); // Update to your actual API call
      openNotification(
        'New Administration Created Successfully! ID: ' + response.data.id
      );
    } catch (error) {
      console.error('Error creating record:', error);
      const errorMessage = error.response?.data?.message;
      openNotification(errorMessage || 'Error creating record', 'error');
    }
  };

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      id="administration-form"
      initialValues={{
        isActive: true,
        isTeacher: false,
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
            <Input disabled={isViewMode} placeholder="A" />
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
            <Input
              disabled={isViewMode}
              placeholder="123 Main St, Springfield"
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Academic Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="highestQualification"
            label="Highest Qualification"
            rules={[{ required: true, message: 'Please input qualification!' }]}
          >
            <Input
              disabled={isViewMode}
              placeholder="PhD in Computer Science"
            />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="specialization"
            label="Specialization"
            rules={[
              { required: true, message: 'Please input specialization!' },
            ]}
          >
            <Input
              disabled={isViewMode}
              placeholder="Artificial Intelligence"
            />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="experienceYears"
            label="Experience (Years)"
            rules={[{ required: true, message: 'Please input experience!' }]}
          >
            <InputNumber
              min={0}
              max={50}
              className="w-full"
              disabled={isViewMode}
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Employment Details
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="facultyId"
            label="Faculty ID"
            rules={[{ required: true, message: 'Please input faculty ID!' }]}
          >
            <InputNumber min={1} className="w-full" disabled={isViewMode} />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="academicProgram"
            label="Academic Program"
            rules={[
              { required: true, message: 'Please input academic program!' },
            ]}
          >
            <InputNumber min={1} className="w-full" disabled={isViewMode} />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="hireDate"
            label="Hire Date"
            rules={[{ required: true, message: 'Please select hire date!' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              className="w-full"
              disabled={isViewMode}
            />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: 'Please input salary!' }]}
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
          <Item name="isTeacher" label="Teaching Staff" valuePropName="checked">
            <Checkbox disabled={isViewMode} />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Additional Information
      </Title>

      <Row gutter={16}>
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
        <Col xs={24} md={8}>
          <Item
            name="emergencyContact"
            label="Emergency Contact"
            rules={[
              { required: true, message: 'Please input emergency contact!' },
              { pattern: phoneRegex, message: 'Invalid phone number format' },
            ]}
          >
            <Input disabled={isViewMode} placeholder="+9876543210" />
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
            {isCreateMode ? 'Create Record' : 'Update Record'}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default AdministrationForm;
