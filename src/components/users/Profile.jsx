import React from 'react';
import {
  Layout,
  Breadcrumb,
  Grid,
  theme,
  Divider,
  Avatar,
  Input,
  Space,
  Form,
  Row,
  Col,
  Button,
  Upload,
} from 'antd';
import { Camera, Mail, MapPin } from 'lucide-react';
import { useAppContext } from '@/app-context';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const Profile = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [form] = Form.useForm();
  const fetchSelfUser = async () => {
    try {
      const { data } = await axios.get(`${constants.urls.users}/me`, {
        headers,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  fetchSelfUser();

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: screens.xs ? 16 : 24,
        }}
      >
        <p className="text-2xl font-bold">Profile</p>
        <Divider />
        <p className="text-xl font-bold">Basic Information</p>
      </div>
      <div
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          margin: screens.xs ? '0 8px' : '0 16px',
        }}
      >
        <div className="p-4">
          <Row>
            <Avatar
              style={{
                backgroundColor: '#fde3cf',
                color: '#f56a00',
              }}
              size={80}
            >
              A
            </Avatar>
            <div className="ml-3 mt-8">
              <Upload>
                <Button className="p-1" size="small">
                  <Camera size={16} />
                </Button>
              </Upload>
            </div>
          </Row>
        </div>
        <Space className="p-4">
          <Form layout="vertical">
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    { required: true, message: 'Please enter your first name' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Middle Name" name="middleName">
                  <Input placeholder="Enter your middle name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: 'Please enter your last name' },
                  ]}
                >
                  <Input placeholder="Enter your last name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your email',
                    },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input
                    prefix={<Mail size={18} />}
                    placeholder="Enter your email"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your phone number',
                    },
                  ]}
                >
                  <Input
                    addonBefore="+977"
                    placeholder="Enter your phone number"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mobile Number"
                  name="mobileNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your mobile number',
                    },
                  ]}
                >
                  <Input
                    addonBefore="+977"
                    placeholder="Enter your mobile number"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label="Address 1" name="address1">
                  <Input
                    prefix={<MapPin size={18} />}
                    placeholder="Address 1"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Address 2" name="address2">
                  <Input
                    prefix={<MapPin size={18} />}
                    placeholder="Address 2"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} className="text-right mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-primary"
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Space>
      </div>
      <div
        style={{
          padding: screens.xs ? 16 : 24,
        }}
      >
        <p className="text-xl font-bold">Permission Group Information</p>
      </div>
      <div
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          margin: screens.xs ? '0 8px' : '0 16px',
        }}
      >
        <p className="p-4 text-sm font-semibold">No group assigned</p>
      </div>
    </Content>
  );
};

export default Profile;
