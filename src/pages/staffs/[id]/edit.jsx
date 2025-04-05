import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import StaffEditForm from '@/components/staffs/StaffEditForm';
import { Breadcrumb, Grid, Layout, theme } from 'antd';
import Link from 'next/link';
import { useStaffs } from '@/hooks/useStaffs';
const { Content } = Layout;
const { useBreakpoint } = Grid;

const EditStaff = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const { id } = router.query;

  const { staffs, isLoading, isError } = useStaffs();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading staff data</div>;

  const staff = staffs?.find((s) => String(s.id) === String(id));

  return (
    <>
      <CustomHead actualTitle="Edit Staff" />
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
          <Breadcrumb.Item>
            <Link href="/staffs" className="text-gray-500 hover:text-gray-700">
              Staffs
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Edit -{staff ? `${staff.fullName}` : 'Staff Profile'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: screens.xs ? 16 : 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <StaffEditForm params={{ id }} />
        </div>
      </Content>
    </>
  );
};

export default EditStaff;
