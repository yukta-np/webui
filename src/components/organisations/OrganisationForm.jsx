import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Upload, Divider, Select } from 'antd';
import { Camera } from 'lucide-react';
import {
  getOrganisationById,
  updateOrganisation,
} from '@/services/organisations.http';
import { openNotification } from '@/utils';
import { useUniversities } from '@/hooks/useUniversities';

const OrganisationForm = ({ orgId }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [organisationData, setOrganisationData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { universities } = useUniversities();

  const populateForm = async () => {
    const response = await getOrganisationById(orgId);
    setOrganisationData(response.data);
    form.setFieldsValue(response.data);
  };

  useEffect(() => {
    populateForm();
  }, [form]);

  const onFinish = async (values) => {
    setIsProcessing(true);
    const myValues = {
      ...values,
    };
    try {
      await updateOrganisation(orgId, myValues);
      openNotification('Organisation updated successfully');
      populateForm();
    } catch (error) {
      console.error('Error updating organisation', error);
      openNotification('Failed to update organisation', true);
    } finally {
      setIsProcessing(false);
    }
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
    form.setFieldsValue({ logo: null });
  };

  const getInitialLetter = () => {
    const name = form.getFieldValue('name') || organisationData?.name || '';
    return name.charAt(0).toUpperCase();
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
            ) : organisationData?.logo ? (
              <img
                src={organisationData?.logo}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span>{() => getInitialLetter()}</span>
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

        <Form form={form} layout="vertical" onFinish={onFinish}>
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
                name="universityId"
                label="Affiliated University"
                rules={[
                  { required: true, message: 'Please enter university name' },
                ]}
              >
                <Select
                  placeholder="Select Affiliated University"
                  options={universities?.map((university) => ({
                    label: university.name,
                    value: university.id,
                  }))}
                />
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
          <Divider />
          <p className="text-xl font-bold mb-4 ">Address</p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
          </Row>

          {/* Communication & Email Section */}
          <Divider />
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
              <Form.Item name="noreplyPhone" label="No-Reply Phone">
                <Input placeholder="Enter no-reply phone" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
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
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter no-reply email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="website" label="Website">
                <Input placeholder="Enter website URL" />
              </Form.Item>
            </Col>
          </Row>
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
