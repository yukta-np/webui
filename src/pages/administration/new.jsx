import { Breadcrumb, Card } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdministrationForm from '@/components/administration/administrationForm';
import React from 'react'

function index() {
  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/administration">Administration</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>New Administration</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Create New Administration">
        <AdministrationForm/>
       
      </Card>
    </div>
  );
}

export default index
