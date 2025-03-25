import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import axios from 'axios';
import { constants } from '@/constants';
import YuktaLogo from '@/svgs/yukta';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Replace with your actual registration endpoint
      const response = await axios.post(constants.urls.registerUrl, {
        invitationCode: values.invitationCode,
        email: values.email,
        password: values.password,
      });

      message.success('Registration successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = [
    { required: true, message: 'Please input your password!' },
    { min: 8, message: 'Password must be at least 8 characters!' },
    {
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Must include uppercase, number, and special character!',
    },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f0f2f5] relative overflow-hidden">
      <div className="flex w-full h-full bg-white shadow-lg">
        {/* Left Side */}
        <div className="relative flex-1 hidden p-8 text-white bg-blue-600 md:block">
          <div className="flex flex-col justify-center h-full max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-2xl font-bold">YUKTA's Connect</div>
            </div>
            <h2 className="mb-6 text-4xl font-bold">HDC College Portal</h2>
            <p className="text-lg opacity-90">
              Complete your registration to access academic resources, connect
              with peers and faculty, and manage your college life through our
              unified platform.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex items-center justify-center flex-1 p-8">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="w-full max-w-md"
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Complete Registration
              </h1>
              {/* <p className="mt-2 text-gray-600">
                Use your college invitation code
              </p> */}
            </div>

            {/* <Form.Item
              name="invitationCode"
              rules={[
                {
                  required: true,
                  message: 'Please input your invitation code!',
                },
              ]}
            >
              <Input
                prefix={<SafetyOutlined className="text-gray-300" />}
                placeholder="Invitation Code"
                size="large"
              />
            </Form.Item> */}

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Invalid email address' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-300" />}
                placeholder="email@college.edu"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={passwordValidation}
              help={<i style={{ fontSize: '0.8rem' }}>  Minimum 8 characters with uppercase, number, and special character</i>}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-300" />}
                placeholder="New Password"
                size="large"
                visibilityToggle
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-300" />}
                placeholder="Confirm Password"
                size="large"
                visibilityToggle
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className="h-12 text-lg"
              >
                Complete Registration
              </Button>
            </Form.Item>

            <div className="mt-4 text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Button
                type="link"
                href="/auth/login"
                size="small"
                className="text-gray-600"
              >
                Login here
              </Button>
            </div>
          </Form>

          {/* Powered By Section */}
          <div className="absolute left-0 right-0 flex items-center justify-center gap-1 px-4 py-2 text-gray-600 bottom-6">
            <YuktaLogo height="26px" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-light text-gray-400">
                Powered by
              </span>
              <span className="text-sm font-medium text-gray-600">
                YUKTA's Connect
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
