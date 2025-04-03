import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import StudentEditForm from '@/components/students/StudentEditForm';
import { Breadcrumb, Grid, Layout, theme } from 'antd';
import Link from 'next/link';
import { useStudents } from '@/hooks/useStudents';
const { Content } = Layout;
const { useBreakpoint } = Grid;

const EditStudent =() => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const { id } = router.query;

    const { students, isLoading, isError } = useStudents();
  
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading student data</div>;
  
    const student = students?.find((s) => String(s.id) === String(id));

  return (
    <>
      <CustomHead actualTitle="Edit Student" />
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
            <Link
              href="/students"
              className="text-gray-500 hover:text-gray-700"
            >
              Students
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Edit -
            {student
              ? `${student.firstName} ${student.middleName} ${student.lastName}`
              : 'Student Profile'}
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
          <StudentEditForm params={{ id }} />
        </div>
      </Content>
    </>
  );
}

export default EditStudent

