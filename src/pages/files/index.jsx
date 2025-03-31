import CustomHead from '@/components/customHead/CustomHead';
import Files from '@/components/files/Files';
import React from 'react';
import { Layout, Grid, theme, Breadcrumb } from 'antd';
const { Content } = Layout;
const { useBreakpoint } = Grid;

const index = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <CustomHead actualTitle="Files" />

      <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Files</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: screens.xs ? 16 : 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Files />
        </div>
      </Content>
    </>
  );
};

export default index;
