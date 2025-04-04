// pages/settings/[id]/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import StudentListPage from '@/components/students/StudentList';
import { Breadcrumb, Grid, Layout, theme } from 'antd';
import Link from 'next/link';
const { Content } = Layout;
const { useBreakpoint } = Grid;

const Page =() => {
   const screens = useBreakpoint();
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
      const router = useRouter();
    const { id } = router.query;

  // on undefined student safely


  return (
    <>
      <CustomHead actualTitle="Students" />
        <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            href="/data-sources"
            className="text-gray-500 hover:text-gray-700"
          >
            Data Sources
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Students</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <StudentListPage />
      </div>
    </Content>
    </>
  );
}

export default Page
