import { Breadcrumb, Card } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StaffForm from '@/components/staffs/StaffForm';
import React from 'react'

function index() {
  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/staffs">Staffs</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>New Staff</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Create New Staff">
        <StaffForm/>
       
      </Card>
    </div>
  );
}

export default index
