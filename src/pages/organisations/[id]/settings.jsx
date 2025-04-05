import CustomHead from '@/components/customHead/CustomHead';
import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import React from 'react';
import { Breadcrumb, Layout, Grid, theme } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const settings = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/organisations">Organisations</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Settings</Breadcrumb.Item>
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
          <CustomHead actualTitle="Organisation Settings" />
          <OrganisationLayout>Settings</OrganisationLayout>;
        </div>
      </Content>
    </>
  );
};

export default settings;
