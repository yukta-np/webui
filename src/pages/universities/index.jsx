import React from 'react';
import { Layout, Grid, theme, Breadcrumb } from 'antd';
import Link from 'next/link';
import UniversityList from '@/components/universities/UniversityList';
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
      <CustomHead actualTitle="Universities" />
      <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/data-sources">Data Sources</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Universities</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: screens.xs ? 16 : 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <UniversityList />
        </div>
      </Content>
    </>
  );
};

export default index;
