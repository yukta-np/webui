// pages/administration/index.jsx
import { useRouter } from 'next/router';
import CustomHead from '@/components/customHead/CustomHead';
import AdministrationList from '@/components/administration/administrationList';
import { Breadcrumb } from 'antd';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  const { administration } = router.query; // Get administration from router

  // on undefined administration safely
  const currentType = administration || '';

  return (
    <>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/settings/data-sources">Data Sources</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Administration</Breadcrumb.Item>
      </Breadcrumb>
      <CustomHead
        actualTitle={`Administration - ${
          administration ? `${administration} Profile` : 'All Administration'
        }`}
      />
      <AdministrationList />
    </>
  );
}
