import React, { useEffect, useState } from 'react';
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
  Upload,
} from 'antd';
import moment from 'moment';
import { createStaff } from '@/services/staff.http'; // Update service import
import { openNotification } from '@/utils';
import { emailRegex, phoneRegex } from '@/utils';
import { UploadOutlined } from '@ant-design/icons';

const { Item } = Form;
const { Title } = Typography;

const StaffForm = ({
  initialValues,
  mode = 'create',
  error,
  loading,
  onFinish,
}) => {
  const [form] = Form.useForm();
  const [isTeacher, setIsTeacher] = useState(false);
  const [isActive, setIsActive] = useState(false);

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
      isTeacher,
      isActive,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      hireDate: values.hireDate?.format('YYYY-MM-DD'),
    };
    try {
      const response = await createStaff(processedValues);
      openNotification(
        'New Staff Created Successfully! ID: ' + response.data.id
      );
    } catch (error) {
      console.error('Error creating staff:', error);
      const errorMessage = error.response?.data?.message;
      openNotification(errorMessage || 'Error creating staff', 'error');
    }
  };

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish || onSubmit}
      id="staff-form"
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
            <Input disabled={isViewMode} placeholder="Dip" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item name="middleName" label="Middle Name">
            <Input disabled={isViewMode} placeholder="Raj" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input disabled={isViewMode} placeholder="Katwal" />
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
              placeholder="dip.katwal@example.com"
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
            <Input disabled={isViewMode} placeholder="9800000000" />
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
            <Input disabled={isViewMode} placeholder="Nepali" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input disabled={isViewMode} placeholder="Kathmandu, Nepal" />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Professional Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item
            name="facultyId"
            label="Faculty ID"
            rules={[{ required: true, message: 'Please input faculty ID!' }]}
          >
            <InputNumber
              className="w-full"
              disabled={isViewMode}
              min={1}
              placeholder="2"
            />
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
            <InputNumber
              className="w-full"
              disabled={isViewMode}
              min={1}
              placeholder="5"
            />
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
        <Col xs={24} md={8}>
          <Item
            name="highestQualification"
            label="Highest Qualification"
            rules={[{ required: true, message: 'Please input qualification!' }]}
          >
            <Input
              disabled={isViewMode}
              placeholder="Masters in Computer Science"
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
            <Input disabled={isViewMode} placeholder="Software Engineering" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="experienceYears"
            label="Experience (Years)"
            rules={[{ required: true, message: 'Please input experience!' }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              disabled={isViewMode}
              placeholder="3"
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Employment Details
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Item
            name="salary"
            label="Salary (NRs)"
            rules={[{ required: true, message: 'Please input salary!' }]}
          >
            <InputNumber
              className="w-full"
              disabled={isViewMode}
              min={0}
              formatter={(value) =>
                `NRs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/NRs\s?|(,*)/g, '')}
            />
          </Item>
        </Col>
        <Col xs={24} md={6}>
          <Item name="isTeacher" label="Teaching Staff" valuePropName="checked">
            <Checkbox
              disabled={isViewMode}
              onChange={(e) => setIsTeacher(e.target.checked)}
            />
          </Item>
        </Col>
        <Col xs={24} md={6}>
          <Item name="isActive" label="Active Status" valuePropName="checked">
            <Checkbox
              disabled={isViewMode}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Additional Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Item
            name="emergencyContact"
            label="Emergency Contact"
            rules={[
              { required: true, message: 'Please input emergency contact!' },
              { pattern: phoneRegex, message: 'Invalid phone number format' },
            ]}
          >
            <Input disabled={isViewMode} placeholder="9812345678" />
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item name="avatar" label="Avatar URL">
            <Upload>
              <Button icon={<UploadOutlined />} style={{ margin: 0 }}>
                Upload
              </Button>
            </Upload>
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
            {isCreateMode ? 'Create Staff' : 'Update Staff'}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default StaffForm;
