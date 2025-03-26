import React, { useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Flex,
  Form,
  Grid,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
} from 'antd';
import { useInquiry } from '@/hooks/useInquiry';
import { createInquiry, updateInquires } from '@/services/inquiries.http';
import { constants, headers, Actions } from '@/constants';
import { openNotification } from '@/utils';
import axios from 'axios';
import { EllipsisVertical, Eye, FilePenLine, Trash2Icon } from 'lucide-react';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const InquiryList = () => {
  const [form] = Form.useForm();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentInquiryId, setCurrentInquiryId] = useState(null);
  const [action, setAction] = useState(Actions.add);
  const { inquiries, revalidate } = useInquiry();

  console.log(inquiries);

  const getTitle = () => {
    if (action === 'add') {
      return 'Add New Details';
    } else if (action === 'edit') {
      return 'Edit details';
    }
    return '';
  };

  const onEdit = (record) => {
    // yo record mathi ko record hoina
    setCurrentInquiryId(record.id);
    setAction(Actions.edit);
    openModal();
    form.setFieldsValue(record); //record yesle bharcha : record filling
  };

  const screens = useBreakpoint();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onAddClick = () => {
    setAction('add');
    openModal();
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`${constants.urls.inquiryUrl}/${id}`, {
        headers,
      });
      openNotification('Inquiry Deleted Successfully');
      revalidate();
    } catch (error) {
      openNotification('Failed to delete inquiry', true);
      console.error('Delete failed:', error);
    }
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);
    console.log(values);
    try {
      setIsProcessing(true);
      const res =
        action === Actions.add
          ? await createInquiry(values)
          : await updateInquires(currentInquiryId, values);
      openNotification(`Inquiry ${action}ed successfully`);
      setIsModalVisible(false);
      revalidate();
      form.resetFields();
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onTableChange = () => {
    revalidate();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
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
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) =>
        screens.md ? (
          <Space size="middle">
            <Button
              type="link"
              icon={<FilePenLine size={18} />}
              onClick={() => onEdit(record)}
            />
            <Popconfirm
              title="Delete the announcement"
              description="Are you sure to delete this announcement?"
              onConfirm={() => onDelete(record.id)}
            >
              <Button
                type="link"
                icon={<Trash2Icon stroke="red" size={18} />}
              />
            </Popconfirm>
          </Space>
        ) : (
          <Dropdown
            overlay={
              <Menu
                items={[
                  { key: 'view', label: 'View', icon: <Eye size={18} /> },
                  {
                    key: 'edit',
                    label: 'Edit',
                    icon: <FilePenLine size={18} />,
                  },
                  {
                    key: 'delete',
                    label: 'Delete',
                    icon: <Trash2Icon size={18} />,
                    danger: true,
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <Button icon={<EllipsisVertical size={18} />} />
          </Dropdown>
        ),
    },
  ];

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <div
        style={{
          padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: 'white',
          borderRadius: 8,
        }}
      >
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
          <Button type="primary" onClick={onAddClick}>
            Add New
          </Button>
        </div>

        <Divider />
        <Table
          rowSelection={{ type: selectionType, ...rowSelection }}
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={inquiries}
          onChange={onTableChange}
        />
        <Modal
          title={getTitle()}
          open={isModalVisible}
          onCancel={closeModal}
          onOk={() => form.submit()}
          confirmLoading={isProcessing}
          footer={
            action === 'add' ? (
              <>
                <Divider />
                <Button className="mr-2" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Apply
                </Button>
              </>
            ) : action === 'edit' ? (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Update
                </Button>
              </>
            ) : (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
              </>
            )
          }
        >
          <Spin spinning={isProcessing}>
            <Form
              layout="vertical"
              disabled={action === 'review'}
              onFinish={onSubmit}
              form={form}
            >
              <Col span={12}>
                <Form.Item name="firstName" label="first-name">
                  <Input placeholder="Enter first name" />
                </Form.Item>
                <Form.Item name="middleName" label="middle-name">
                  <Input placeholder="Enter middle name" />
                </Form.Item>
                <Form.Item name="lastName" label="last-name">
                  <Input placeholder="Enter last name" />
                </Form.Item>
                <Form.Item name="type" label="type">
                  <Input placeholder="Select type" />
                </Form.Item>
                <Form.Item name="email" label="email">
                  <Input placeholder="Enter email" />
                </Form.Item>
                <Form.Item name="phoneNumber" label="phone number">
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Form>
          </Spin>
        </Modal>
      </div>
    </Content>
  );
};

export default InquiryList;
