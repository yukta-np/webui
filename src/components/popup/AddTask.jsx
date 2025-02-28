import React, { useState, useEffect } from 'react';
import Modal from 'antd/es/modal/Modal';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  Typography,
  Space,
  Avatar,
} from 'antd';
import { InboxOutlined, SyncOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';

// Dynamically import SunEditor to ensure it's only loaded on the client side
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

const AddTask = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [task, setTask] = useState({
    creatorId: 1,
    taskStatus: 1,
    assigneeId: 2,
    title: 'Sample Task',
    description: 'This is a description of the task.',
  });

  const handleEditorChange = (content) => {
    setTask({ ...task, description: content });
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const onSubmit = (values) => {
    console.log('Form Values:', values);
    console.log('SunEditor Content:', task.description);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsModalVisible(false);
    }, 1000);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Task
      </Button>

      <Modal
        title="Task"
        open={isModalVisible}
        onOk={form.submit}
        onCancel={hideModal}
        width={1000}
        confirmLoading={isProcessing}
        style={{ top: 20 }}
      >
        <Form layout={'vertical'} onFinish={onSubmit} form={form}>
          <Row gutter={24}>
            <Col span={18}>
              <Row gutter={8}>
                <Col span={24}>
                  <Form.Item
                    label="Title"
                    name="title"
                    initialValue={task.title}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the title',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Description"
                    required
                    name="description"
                    tooltip="This is a required field"
                    rules={[
                      { required: true, message: 'Description is required' },
                    ]}
                  >
                    {/* Render SunEditor only on the client-side */}
                    <SunEditor
                      value={task.description}
                      onChange={handleEditorChange}
                      height="250px"
                      setOptions={{
                        buttonList: [
                          [
                            'formatBlock',
                            'bold',
                            'underline',
                            'italic',
                            'strike',
                            'fontColor',
                            'hiliteColor',
                            'list',
                            'table',
                            'link',
                          ],
                          ['fullScreen'],
                        ],
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row gutter={8}>
                <Col span={24}>
                  <Form.Item label="Status" name="taskStatus">
                    <Select defaultValue={task.taskStatus}>
                      <Select.Option value={1}>To Do</Select.Option>
                      <Select.Option value={2}>In Progress</Select.Option>
                      <Select.Option value={3}>Completed</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Assign To" name="assigneeId">
                    <Select defaultValue={task.assigneeId}>
                      <Select.Option value={1}>John Doe</Select.Option>
                      <Select.Option value={2}>Jane Doe</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Due Date" name="dueDate">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Optional: File Upload */}
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="File Upload">
                {/* Add your upload component here if needed */}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddTask;
