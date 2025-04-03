import Datasources from '@/components/datasource/Datasources';
import React from 'react';
import { Breadcrumb, Grid, Layout, theme } from 'antd';
import Link from 'next/link';
import CustomHead from '@/components/customHead/CustomHead';
const { Content } = Layout;
const { useBreakpoint } = Grid;

const index = () => {
     const screens = useBreakpoint();
     const {
       token: { colorBgContainer, borderRadiusLG },
     } = theme.useToken();
  return (
    <>
     <CustomHead actualTitle="Data Sources" />
       <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Data Sources</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Datasources />
      </div>
    </Content>
    </>
  );
};

export default index;
