import { useAppContext } from '@/app-context';
import CustomHead from '@/components/customHead/CustomHead';
import OrganisationForm from '@/components/organisations/OrganisationForm';
import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import React from 'react';
import { Breadcrumb, Layout, Grid, theme } from 'antd';
import Link from 'next/link';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const edit = () => {
  const { loggedInUser } = useAppContext();
  const orgId = loggedInUser?.orgId;
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
        <Breadcrumb.Item>Organisations</Breadcrumb.Item>
        <Breadcrumb.Item>Edit Organisation</Breadcrumb.Item>
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
          <CustomHead actualTitle="Edit Organisation" />
          <OrganisationLayout>
            <OrganisationForm orgId={orgId} />
          </OrganisationLayout>
        </div>
      </Content>
    </>
  );
};

export default edit;
