import React, { useState } from 'react';
import { Rate, Form, Input, Button, Upload, message, Select, Spin } from 'antd';
import { InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const FeedbackModule = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmission = async (values) => {
    setSubmitting(true);
    try {
      // Add your API integration here
      console.log('Feedback payload:', { ...values, attachments: fileList });
      message.success('Feedback submitted successfully');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Feedback submission failed');
    }
    setSubmitting(false);
  };

  const uploadConfig = {
    multiple: true,
    accept: 'image/*,.pdf',
    beforeUpload: (file) => {
      setFileList((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    fileList,
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-card">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Institutional Feedback Portal
      </h1>
      <p className="text-gray-500 mb-8">
        Share your experience to help improve campus services
      </p>

      <Spin spinning={submitting}>
        <Form
          form={form}
          onFinish={handleSubmission}
          layout="vertical"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Feedback Category"
              name="category"
              rules={[{ required: true, message: 'Please select category' }]}
              className="mb-0"
            >
              <Select placeholder="Select department/service">
                <Option value="academics">Academic Services</Option>
                <Option value="administration">Administrative Services</Option>
                <Option value="facilities">Campus Infrastructure</Option>
                <Option value="support">Student Services</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Service Rating"
              name="rating"
              rules={[{ required: true, message: 'Please provide rating' }]}
              className="mb-0"
            >
              <Rate allowHalf style={{ color: '#3b82f6' }} />
            </Form.Item>
          </div>

          <Form.Item
            label="Detailed Feedback"
            name="feedback"
            rules={[
              { required: true, message: 'Please provide detailed feedback' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your experience in detail"
              className="rounded-lg border-gray-200"
            />
          </Form.Item>

          <Form.Item
            label="Supporting Evidence"
            help="Upload relevant documents or images (max 5 files)"
          >
            <Dragger {...uploadConfig} className="bg-gray-50 rounded-lg">
              <div className="p-4 text-center">
                <p className="text-4xl text-gray-400 mb-2">
                  <CloudUploadOutlined />
                </p>
                <p className="text-gray-600 font-medium">
                  Drag & drop files or click to browse
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Supported formats: JPEG, PNG, PDF (Max 5MB each)
                </p>
              </div>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="Submission Status"
            name="status"
            initialValue="pending"
            className="w-48"
          >
            <Select>
              <Option value="pending">Pending Review</Option>
              <Option value="acknowledged">Acknowledged</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-lg font-semibold"
              loading={submitting}
            >
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default FeedbackModule;
