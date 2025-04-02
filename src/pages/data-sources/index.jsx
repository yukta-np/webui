import Datasources from '@/components/datasource/Datasources';
import React from 'react';
import { Breadcrumb } from 'antd';
import Link from 'next/link';

const index = () => {
  return (
    <>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Data Sources</Breadcrumb.Item>
      </Breadcrumb>
      <Datasources />
    </>
  );
};

export default index;
