import React, { useState } from 'react';
import { Button, Flex, Modal, Space, Form, Input, Radio } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? (
      <Tag color="error">Required</Tag>
    ) : (
      <Tag color="warning">optional</Tag>
    )}
    {label}
  </>
);
const AddTask = () => {
    const [open, setOpen] = useState(false);
    const [openResponsive, setOpenResponsive] = useState(false);

    const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');
  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };
    return (
    <Flex vertical gap="middle" align="flex-start">
      {/* Responsive */}
      <Button type="primary" onClick={() => setOpenResponsive(true)}>
        Add Task
      </Button>
      {/* Whole form goes here */}
      <Modal
        title="Task Form"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
        {/* input form goes here */}
        <Space>
          {/* Left side */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              requiredMarkValue: requiredMark,
            }}
            onValuesChange={onRequiredTypeChange}
            requiredMark={
              requiredMark === 'customize'
                ? customizeRequiredMark
                : requiredMark
            }
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input the title of the task!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            </Form>
          <Space></Space>

          {/* Right side */}
          <Space></Space>
        </Space>
      </Modal>
    </Flex>
  );
  
}

export default AddTask