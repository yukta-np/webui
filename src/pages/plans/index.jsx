import CustomHead from '@/components/customHead/CustomHead';
import Plans from '@/components/plans/Plans';
import React from 'react';
import { Breadcrumb, Layout, Grid, theme } from 'antd';
import Link from 'next/link';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const plans = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Plans</Breadcrumb.Item>
      </Breadcrumb>
      <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
        <div
          style={{
            padding: screens.xs ? 16 : 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <CustomHead actualTitle="Plans" />
          <Plans />
        </div>
      </Content>
    </>
  );
};

export default plans;
