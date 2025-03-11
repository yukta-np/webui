import React, { useState } from 'react';
import {
  Rate,
  Form,
  Input,
  Button,
  Upload,
  message,
  Select,
  Spin,
  Modal,
  Tag,
  List,
  Avatar,
} from 'antd';
import {
  InboxOutlined,
  CloudUploadOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileImageOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const FeedbackPortal = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const submission = {
        ...values,
        attachments: fileList,
        date: new Date().toISOString(),
        id: Date.now(),
        status: 'pending',
      };

      setHistory((prev) => [submission, ...prev]);
      message.success('Feedback submitted successfully');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Submission failed');
    }
    setSubmitting(false);
  };

  const uploadProps = {
    multiple: true,
    accept: 'image/*,.pdf',
    beforeUpload: (file) => {
      if (file.size > 5 * 1024 * 1024) {
        message.error(`${file.name} exceeds 5MB limit`);
        return Upload.LIST_IGNORE;
      }
      setFileList((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    fileList,
  };

  const statusColors = {
    pending: 'blue',
    acknowledged: 'orange',
    resolved: 'green',
    rejected: 'red',
  };

  const loadHistoryEntry = (entry) => {
    form.setFieldsValue({
      category: entry.category,
      rating: entry.rating,
      feedback: entry.feedback,
      priority: entry.priority,
      status: entry.status,
      department: entry.department,
      anonymous: entry.anonymous,
    });
    setFileList(entry.attachments);
    setSelectedHistory(entry.id);
  };

  const renderPreviewContent = () => {
    const values = form.getFieldsValue();
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Category:</label>
            <p>{values.category?.replace(/-/g, ' ') || 'N/A'}</p>
          </div>
          <div>
            <label className="font-medium">Rating:</label>
            <Rate disabled value={values.rating} />
          </div>
          <div>
            <label className="font-medium">Priority:</label>
            <Tag
              color={
                values.priority === 'high'
                  ? 'red'
                  : values.priority === 'medium'
                  ? 'orange'
                  : 'green'
              }
            >
              {values.priority?.toUpperCase()}
            </Tag>
          </div>
          <div>
            <label className="font-medium">Status:</label>
            <Tag color={statusColors[values.status]}>
              {values.status?.toUpperCase()}
            </Tag>
          </div>
        </div>

        <div>
          <label className="font-medium">Feedback Details:</label>
          <p className="whitespace-pre-wrap">
            {values.feedback || 'No feedback provided'}
          </p>
        </div>

        <div>
          <label className="font-medium">Attachments:</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {fileList.map((file, index) => (
              <div key={index} className="border p-2 rounded">
                {file.type?.includes('image') ? (
                  <FileImageOutlined className="text-2xl text-blue-500" />
                ) : (
                  <FilePdfOutlined className="text-2xl text-red-500" />
                )}
                <p className="truncate text-sm">{file.name}</p>
              </div>
            ))}
            {fileList.length === 0 && <p>No attachments</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="xl:grid xl:grid-cols-3 gap-8 h-full">
          {/* Submission History */}
          <div className="bg-gray-50 p-6 rounded-l-2xl border-r h-[calc(100vh-4rem)] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Submission History</h3>
            <List
              dataSource={history}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer p-3 rounded-lg hover:bg-white transition-all ${
                    selectedHistory === item.id ? 'bg-white shadow-md' : ''
                  }`}
                  onClick={() => loadHistoryEntry(item)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: statusColors[item.status] }}
                      >
                        {item.category?.slice(0, 2).toUpperCase()}
                      </Avatar>
                    }
                    title={
                      <Tag color={statusColors[item.status]}>{item.status}</Tag>
                    }
                    description={
                      <>
                        <Rate
                          disabled
                          value={item.rating}
                          className="text-sm"
                        />
                        <p className="text-gray-600 line-clamp-2 mt-1 text-sm">
                          {item.feedback}
                        </p>
                        <div className="mt-2 text-xs text-gray-400">
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>

          {/* Main Form */}
          <div className="xl:col-span-2 p-8 h-[calc(100vh-4rem)] overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Academic Feedback Management System
            </h1>
            <p className="text-gray-500 mb-8">
              Official feedback channel for institutional improvement
            </p>

            <Spin spinning={submitting}>
              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Feedback Category"
                    name="category"
                    rules={[{ required: true, message: 'Required field' }]}
                  >
                    <Select placeholder="Select department">
                      <Option value="academic-curriculum">
                        Academic Curriculum
                      </Option>
                      <Option value="faculty-performance">
                        Faculty Performance
                      </Option>
                      <Option value="campus-facilities">
                        Campus Facilities
                      </Option>
                      <Option value="student-services">Student Services</Option>
                      <Option value="administrative-processes">
                        Administrative Processes
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Service Rating (1-5)"
                    name="rating"
                    rules={[{ required: true, message: 'Required field' }]}
                  >
                    <Rate
                      allowHalf
                      style={{ color: '#2563eb' }}
                      tooltips={[
                        'Poor',
                        'Fair',
                        'Good',
                        'Very Good',
                        'Excellent',
                      ]}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Detailed Feedback"
                  name="feedback"
                  rules={[
                    {
                      required: true,
                      min: 50,
                      message: 'Minimum 50 characters required',
                    },
                  ]}
                >
                  <TextArea
                    rows={5}
                    placeholder="Provide comprehensive feedback including specific instances, suggestions, and outcomes"
                    showCount
                    maxLength={1000}
                    className="rounded-lg border-gray-200"
                  />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Priority Level"
                    name="priority"
                    initialValue="medium"
                  >
                    <Select>
                      <Option value="high">
                        <Tag color="red">High Priority</Tag>
                      </Option>
                      <Option value="medium">
                        <Tag color="orange">Medium Priority</Tag>
                      </Option>
                      <Option value="low">
                        <Tag color="green">Low Priority</Tag>
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Attachments"
                    help="Max 5 files (images/PDFs)"
                  >
                    <Dragger {...uploadProps} className="bg-gray-50 rounded-lg">
                      <div className="p-4 text-center">
                        <p className="text-4xl text-gray-400 mb-2">
                          <CloudUploadOutlined />
                        </p>
                        <p className="text-gray-600 font-medium">
                          Drag & drop evidence files
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Supported formats: JPEG, PNG, PDF (5MB max each)
                        </p>
                      </div>
                    </Dragger>
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Status Tracking"
                    name="status"
                    initialValue="pending"
                  >
                    <Select>
                      <Option value="pending">
                        <Tag color="blue">Pending Review</Tag>
                      </Option>
                      <Option value="in-progress">
                        <Tag color="orange">In Progress</Tag>
                      </Option>
                      <Option value="resolved">
                        <Tag color="green">Resolved</Tag>
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Department Routing" name="department">
                    <Select placeholder="Auto-routed based on category">
                      <Option value="academic">Academic Affairs</Option>
                      <Option value="facilities">Facilities Management</Option>
                      <Option value="administration">Administration</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item name="anonymous" valuePropName="checked">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-600">Submit anonymously</span>
                  </div>
                </Form.Item>

                <div className="flex justify-between items-center">
                  <Button
                    type="default"
                    size="large"
                    className="flex items-center"
                    onClick={() => setPreviewVisible(true)}
                  >
                    <EyeOutlined className="mr-2" />
                    Preview Submission
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-lg font-semibold"
                    loading={submitting}
                  >
                    Submit Feedback
                  </Button>
                </div>
              </Form>
            </Spin>
          </div>
        </div>
      </div>

      <Modal
        title="Submission Preview"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
          >
            Confirm Submission
          </Button>,
        ]}
        width={800}
      >
        {renderPreviewContent()}
      </Modal>
    </div>
  );
};

export default FeedbackPortal;
