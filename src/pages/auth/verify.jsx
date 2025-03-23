import { VerifyTokenForm } from '@/components/auth/Verify';
import { constants } from '@/constants';
import { Alert, Card, Col, Row, Typography } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const verify = () => {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [type, setType] = useState(null);
  const [msg, setMsg] = useState(null);

  const { token } = router.query;
  let res = {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        res = await axios.post(constants.urls.verifyUrl, { token });
        console.log(JSON.stringify(res.data, null, 4));
        setEmail(res.data.email);
        setType(res.data.type);
      } catch (e) {
        setMsg(e.response.data.message);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <>
      <CustomHead actualTitle="Verify" />
      <div className="login-page">
        <Row>
          <Col
            span={12}
            flex
            style={{ flexDirection: 'column', background: '#f3f3f3' }}
          >
            <div style={{ width: '50%', margin: 'auto', marginTop: 250 }}>
              <Card style={{ borderRadius: '6px' }}>
                {msg ? (
                  <Alert description={msg} type="error" />
                ) : (
                  <VerifyTokenForm
                    token={token}
                    msg={msg}
                    email={email}
                    type={type}
                  />
                )}
              </Card>
              <Typography.Text level={5} className="block mt-5 text-center">
                Powered by: <img src="/logo.svg" height={25} alt="Yukta" />
              </Typography.Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="auth-side-text">
              <Typography.Title level={3}>
                Welcome to Yukta Management Software
              </Typography.Title>
              <Typography.Title level={1}>
                Get ready to collaborate using the Most Advanced Management
                Software
              </Typography.Title>
            </div>
            <div className="auth-side-mask"> </div>
            <div className="auth-side"></div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default verify;
