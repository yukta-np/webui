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
import { createStudent } from '@/services/students.http';
import { openNotification } from '@/utils';
import { emailRegex, phoneRegex } from '@/utils';
import { UploadOutlined } from '@ant-design/icons';

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
  const [isCR, setIsCR] = useState(false);
  const [scholarshipStatus, setScholarshipStatus] = useState(false);
  const [isActive, setIsActive] = useState(false);

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
    const processedValues = {
      ...values,
      isCR,
      isActive,
      scholarshipStatus,
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
            <Input disabled={isViewMode} placeholder="Chandra" />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input disabled={isViewMode} placeholder="Ojha" />
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
              placeholder="dip.ojha@example.com"
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
            <Input disabled={isViewMode} placeholder="+977 123456789" />
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
            <Input disabled={isViewMode} placeholder="Koshi, Morang" />
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
            label="Due Amount (NRs)"
            rules={[{ required: true, message: 'Please input due amount!' }]}
            initialValue={initialValues?.dueAmount || 0}
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
        <Col xs={24} md={12}>
          <Item
            name="scholarshipStatus"
            label="Scholarship Status"
            value={scholarshipStatus}
          >
            <Checkbox
              disabled={isViewMode}
              onChange={(e) => setScholarshipStatus(e.target.checked)}
            />
          </Item>
        </Col>
      </Row>

      <Title level={4} className="mb-6 mt-6">
        Additional Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Item name="isCr" label="Class Representative" value={isCR}>
            <Checkbox
              disabled={isViewMode}
              onChange={(e) => setIsCR(e.target.checked)}
            />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item name="isActive" label="Active Status" value={isActive}>
            <Checkbox
              disabled={isViewMode}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Item>
        </Col>
        <Col xs={24} md={8}>
          <Item name="avatar" label="Avatar URL">
            <Upload>
              <Button icon={<UploadOutlined />} style={{ margin: 0 }}>
                Upload
              </Button>
            </Upload>
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
            <Input disabled={isViewMode} placeholder="Chandra Prasad Ojha" />
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
            <Input disabled={isViewMode} placeholder="+977 9876543210" />
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
            <Input disabled={isViewMode} placeholder="+977 9876543210" />
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
