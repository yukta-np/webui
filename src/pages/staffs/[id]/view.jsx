import StaffLayout from '@/components/staffs/StaffLayout';
import StaffProfile from '@/components/staffs/StaffProfile';
import React from 'react';
import { useRouter } from 'next/router';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useStaffs } from '@/hooks/useStaffs';

const Index = () => {
  const router = useRouter();
  const id = router.query.id;
  const { staffs, isLoading, isError } = useStaffs();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading staff data</div>;

  const staff = staffs?.find((s) => String(s.id) === String(id));

  return (

    <>
      <Breadcrumb style={{ margin: '16px' }}>
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
          {staff
            ? `${staff.fullName}`
            : 'Staff Profile'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <StaffLayout>
        <StaffProfile params={{ id }} />
      </StaffLayout>
    </>
  );
};

export default Index;

