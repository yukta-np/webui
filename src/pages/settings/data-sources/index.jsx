import Datasources from '@/components/datasource/Datasources';
import React from 'react';
import { Breadcrumb } from 'antd';

const index = () => {
  return (
    <>
      <Breadcrumb style={{ margin: '16px ' }}>
        <Breadcrumb.Item>
          <a href="/">Home</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Settings</Breadcrumb.Item>
      </Breadcrumb>
      <Datasources />
    </>
  );
};

export default index;
