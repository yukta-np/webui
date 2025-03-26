import React, { useState } from 'react';
import { useInquiry } from '@/hooks/useInquiry';
import { Button, Divider, Grid, Table } from 'antd';
const { useBreakpoint } = Grid;

const InquiryList = () => {
  const [selectionType, setSelectionType] = useState('checkbox');
  const { inquiries } = useInquiry();
  console.log(inquiries);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
  ];

  const screens = useBreakpoint();

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: screens.xs ? 'column' : 'row',
          gap: 16,
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <p className="text-xl font-bold">Inquiries</p>
        <Button type="primary">Add New</Button>
      </div>

      <Divider />
      <Table
        rowSelection={Object.assign({ type: selectionType }, rowSelection)}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={inquiries}
      />
    </>
  );
};

export default InquiryList;
