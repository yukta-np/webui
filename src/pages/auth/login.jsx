import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const generateShapes = () =>
      Array(10)
        .fill(0)
        .map((_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 80,
          opacity: 0.1 + Math.random() * 0.2,
          rotation: Math.random() * 360,
          speed: 0.5 + Math.random() * 1.5,
        }));

    const animate = () => {
      setShapes((prev) =>
        prev.map((shape) => ({
          ...shape,
          y: (shape.y - shape.speed * 0.05) % 100,
          rotation: (shape.rotation + 0.05) % 360,
        }))
      );
    };

    setShapes(generateShapes());
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  const onFinish = async ({ email, password, remember }) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success(`Welcome to HDC College Portal`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f0f2f5] relative overflow-hidden">
      <div className="w-full h-full flex bg-white shadow-lg">
        <div className="hidden md:block flex-1 bg-blue-600 p-8 text-white relative">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-2xl font-bold">YUKTA's Connect</div>
            </div>
            <h2 className="text-4xl font-bold mb-6">HDC College Portal</h2>
            <p className="text-lg opacity-90">
              Access academic resources, connect with peers and faculty, and
              manage your college life through our unified platform.
            </p>
          </div>
        </div>

        <div className="flex-1 p-8 flex items-center justify-center relative">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
              <p className="text-gray-600 mt-2">Use your college credentials</p>
            </div>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Invalid email address' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-300" />}
                placeholder="email@college.edu"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-300" />}
                placeholder="Password"
                size="large"
                visibilityToggle
              />
            </Form.Item>

            <div className="flex justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Button type="link" size="small" className="text-gray-600">
                Forgot password?
              </Button>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className="h-12 text-lg"
              >
                Sign in
              </Button>
            </Form.Item>

            <div className="text-center text-sm text-gray-500 mt-4">
              Need access?{' '}
              <Button type="link" size="small" className="text-gray-600">
                Contact support
              </Button>
            </div>
          </Form>

          {/* Improved Powered By Section */}
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 px-4 py-2">
            <img
              src="/yuktaLogo.png"
              alt="YUKTA Logo"
              className="h-10 w-10 opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-400 font-light">
                Powered by
              </span>
              <span className="text-sm text-gray-600 font-medium">
                YUKTA's Connect
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
