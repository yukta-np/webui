import OrganisationLayout from '@/components/organisations/OrganisationLayout';
import OrganisationDetails from '@/components/organisations/OrganisationDetails';
import React from 'react';
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import { Breadcrumb, Layout, Grid, theme } from 'antd';
import Link from 'next/link';
import { useAppContext } from '@/app-context';
import { Roles } from '@/utils';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const index = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const id = router.query.id;
  const { loggedInUser } = useAppContext();
  console.log(loggedInUser?.role);
  return (
    <>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Home</Link>
        </Breadcrumb.Item>
        {loggedInUser?.role === Roles.SYSADMIN ? (
          <Breadcrumb.Item>
            <Link href="/organisations">Organisations</Link>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Organisation</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>Details</Breadcrumb.Item>
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
          <CustomHead actualTitle="Organisation Details" />
          <OrganisationLayout>
            <OrganisationDetails params={{ id }} />
          </OrganisationLayout>
        </div>
      </Content>
    </>
  );
};

export default index;
