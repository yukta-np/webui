import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Switch,
  Upload,
  Card,
  Avatar,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Camera } from 'lucide-react';

const OrganisationForm = (orgId) => {
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const initialValues = {
    id: 1,
    name: 'Kathmandu Engineering College',
    address: 'Imadol, Lalitpur',
    phone: '01-5555555',
    email: 'info@ke.edu.np',
    noreplyEmail: 'noreply@ke.edu.np',
    noreplyPhone: '01-5555555',
    website: 'https://www.ke.edu.np',
    panNumber: '123456789',
    vatNumber: '987654321',
    isActive: true,
    isArchived: false,
    logo: 'ke-logo.png',
    universityName: 'Tribhuvan University',
  };

  const onFinish = (values) => {
    console.log('Received values:', values);
    // Handle form submission here
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  const handleRemove = () => {
    setPreviewImage(null);
    form.setFieldsValue({ logo: null }); // Clear the form field if needed
  };

  return (
    <>
      <div className="ml-4 mt-4">
        <Row className="mb-8">
          <div
            style={{
              width: 100,
              height: 90,
              overflow: 'hidden',
              backgroundColor: '#87d068',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Logo preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : initialValues.avatarUrl ? (
              <img
                src={initialValues.avatarUrl}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span style={{ fontSize: 32, color: '#fff' }}>
                {initialValues.name.toUpperCase()[0]}
              </span>
            )}
          </div>
          <div className="ml-3 mt-8">
            <Upload
              accept="image/*"
              beforeUpload={handleUpload}
              showUploadList={false}
            >
              <Button className="p-1" size="small">
                <Camera size={16} />
              </Button>
            </Upload>
          </div>
          {previewImage && (
            <Button
              type="text"
              danger
              size="small"
              onClick={handleRemove}
              style={{
                position: 'absolute',
                right: -8,
                top: -8,
                zIndex: 1,
              }}
            >
              ×
            </Button>
          )}
        </Row>

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <p className="text-xl font-bold mb-4 ">Basic Information</p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: 'Please enter college name' },
                ]}
              >
                <Input placeholder="Enter college name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="universityName"
                label="University"
                rules={[
                  { required: true, message: 'Please enter university name' },
                ]}
              >
                <Input placeholder="Enter university name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="panNumber"
                label="PAN Number"
                rules={[{ required: true, message: 'Please enter PAN number' }]}
              >
                <Input placeholder="Enter PAN number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="vatNumber"
                label="VAT Number"
                rules={[{ required: true, message: 'Please enter VAT number' }]}
              >
                <Input placeholder="Enter VAT number" />
              </Form.Item>
            </Col>
          </Row>

          {/* Address Section */}
          <p className="text-xl font-bold mb-4 ">Address</p>
          <Form.Item
            name="address"
            label="Full Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter address" />
          </Form.Item>

          {/* Communication & Email Section */}
          <p className="text-xl font-bold mb-4 ">Communication</p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="noreplyPhone"
                label="No-Reply Phone"
                rules={[
                  { required: true, message: 'Please enter no-reply phone' },
                ]}
              >
                <Input placeholder="Enter no-reply phone" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Primary Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="noreplyEmail"
                label="No-Reply Email"
                rules={[
                  { required: true, message: 'Please enter no-reply email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter no-reply email" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true, message: 'Please enter website URL' }]}
          >
            <Input placeholder="Enter website URL" />
          </Form.Item>
          <Row>
            <Col xs={24} className="text-right mb-4">
              <Button
                type="primary"
                htmlType="submit"
                className="btn-primary"
                onClick={() => form.submit()}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default OrganisationForm;
