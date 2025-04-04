import { Breadcrumb, Card } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentForm from '@/components/students/StudentForm';
import React from 'react'

function index() {
  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/students">Students</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>New Student</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Create New Student">
        <StudentForm/>
       
      </Card>
    </div>
  );
}

export default index