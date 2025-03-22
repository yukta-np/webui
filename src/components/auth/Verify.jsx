import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Checkbox, Alert, Typography } from 'antd';
import { useRouter } from 'next/router';
import { constants } from '../../../src/constants';
import { CloseCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';

export const VerifyTokenForm = ({ token, msg, email, type }) => {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  let tmt;

  if (process.browser && token) {
    if (msg) {
      clearTimeout(tmt);
      return (
        <>
          <p>
            <CloseCircleOutlined twoToneColor="#ff0000" /> {msg}
          </p>
        </>
      );
    } else {
      const state = `${btoa(email)}.${btoa(token)}.${btoa(type)}`;
      if (email) {
        tmt = setTimeout(
          () => router.push(`/auth/set-password?state=${state}`),
          1000
        );
      }

      return (
        <>
          <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 22 }} />{' '}
          Email Verified
        </>
      );
    }
  }

  const onFinish = async (values) => {
    const { token } = values;
    const { state } = router.query;
    const email = atob(state);

    setIsProcessing(true);
    try {
      await axios.post(constants.urls.verifyCodeUrl, {
        code: token,
        email,
      });
      const state = `${btoa(email)}.${btoa(token)}.${btoa('recovery')}`;

      router.push(`/auth/set-password?state=${state}`);
    } catch (e) {
      if (e.response) {
        setMessage(e.response.data.message);
        setIsAlertVisible(true);
      }
    }
    setIsProcessing(false);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      {isAlertVisible && (
        <Alert
          description={message}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      <p>Enter the Password Recovery Code sent you in the recovery email.</p>
      <Form.Item
        name="token"
        rules={[
          {
            required: true,
            message: 'Please input the token!',
          },
        ]}
      >
        <Input
          size="large"
          // prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Token"
        />
      </Form.Item>

      <Form.Item>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={isProcessing}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
