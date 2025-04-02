import React, { useState, useRef, useEffect, use } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Row,
  Col,
  DatePicker,
  Divider,
} from 'antd';
import {
  GlobalOutlined,
  EnvironmentOutlined,
  ContactsOutlined,
  MailOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';
import { useUniversities } from '@/hooks/useUniversities';
import {
  createUniversity,
  deleteUniversity,
  getUniversityById,
  updateUniversity,
} from '@/services/universities.http';
import { Actions } from '@/constants';
import { openNotification } from '@/utils';

const UniversityList = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(Actions.add);
  const [id, setId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const searchInput = useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});

  const { universities, isLoading, isError, revalidate } = useUniversities();

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => onSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => onSearch(selectedKeys, confirm, dataIndex)}
            icon={<Search size={14} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              onReset(dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <Search size={14} style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    filteredValue: filteredInfo[dataIndex] || null,
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      width: 80,
      render: (text, record) => (
        <a className="text-blue-600" onClick={() => onView(record.id)}>
          UNI-{text}
        </a>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: true,
    },
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      key: 'shortName',

      ...getColumnSearchProps('shortName'),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <div>
            <MailOutlined /> {record.email}
          </div>
          <div>
            <ContactsOutlined /> {record.contact}
          </div>
        </Space>
      ),
    },
    {
      title: 'Address',
      key: 'address',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <div>
            <GlobalOutlined />{' '}
            <a href={record.website} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          </div>
          <div>
            <EnvironmentOutlined /> {record.address}
          </div>
        </Space>
      ),
    },
    {
      title: 'Established',
      dataIndex: 'established',
      key: 'established',
      render: (date) => moment(date).format('MMMM Do, YYYY'),
      sorter: (a, b) => new Date(a.established) - new Date(b.established),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FilePenLine size={18} />}
            onClick={() => onEdit(record.id)}
          />
          <Popconfirm
            title="Are you sure you want to delete this university?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="link" danger icon={<Trash2Icon size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onAdd = () => {
    setAction(Actions.add);
    form.resetFields();
    showModal();
  };

  const onView = async (id) => {
    setAction(Actions.view);
    const { data } = await getUniversity(id);
    populateFrom(data);
    showModal();
  };

  const populateFrom = (data) => {
    console.log(data);
    const myData = {
      ...data,
      established: data?.established ? moment(data.established) : null,
    };
    form.setFieldsValue(myData);
  };

  const onEdit = async (id) => {
    setId(id);
    setAction(Actions.edit);
    const { data } = await getUniversityBYId(id);
    populateFrom(data);
    showModal();
  };

  const onFinish = async (values) => {
    setIsProcessing(true);
    setAction(Actions.add);
    try {
      const payload = {
        ...values,
        established: values.established
          ? values.established.format('YYYY-MM-DD')
          : null,
      };
      action === Actions.add
        ? await createUniversity(payload)
        : await updateUniversity(id, payload);
      openNotification(`University ${action}ed successfully`);
      revalidate();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      openNotification('Failed to add university', true);
      console.error('Validation failed:', error);
    } finally {
      setIsProcessing(false);
    }

    return;
  };

  const onDelete = async (id) => {
    await deleteUniversity(id);
    openNotification('University deleted successfully');
    revalidate();
  };

  const onSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const onReset = (dataIndex) => {
    setFilteredInfo((prev) => ({
      ...prev,
      [dataIndex]: null,
    }));
  };

  return (
    <div>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p className="text-xl font-bold m-0">Universities</p>
        <Button type="primary" onClick={onAdd}>
          Add New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={universities}
        bordered
        pagination={{ pageSize: 5 }}
        onChange={(pagination, filters, sorter) => {
          setFilteredInfo(filters);
        }}
      />

      <Modal
        title={
          action === Actions.view
            ? 'University Details'
            : action === Actions.add
            ? 'Add University'
            : 'Edit University'
        }
        open={isModalVisible}
        onCancel={closeModal}
        width={700}
        footer={
          action === Actions.view ? (
            <Button key="back" onClick={closeModal}>
              Cancel
            </Button>
          ) : (
            [
              <Button key="back" onClick={closeModal}>
                Cancel
              </Button>,

              <Button key="submit" type="primary" onClick={() => form.submit()}>
                {action === Actions.add ? 'Add' : 'Save'}
              </Button>,
            ]
          )
        }
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          disabled={action === Actions.view}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="University Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input university name!',
                  },
                ]}
              >
                <Input placeholder="Enter university name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="shortName"
                label="Short Name"
                rules={[
                  { required: true, message: 'Please input short name!' },
                ]}
              >
                <Input placeholder="Enter short name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input
                  placeholder="Enter email address"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contact" label="Contact Number">
                <Input
                  placeholder="Enter contact number"
                  prefix={<ContactsOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="website"
                label="Website"
                rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}
              >
                <Input
                  placeholder="Enter website URL"
                  prefix={<GlobalOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="established"
                label="Established Date"
                rules={[
                  {
                    required: true,
                    message: 'Please select established date!',
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  picker="date"
                  disabledDate={(current) =>
                    current && current > moment().endOf('day')
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Address">
            <Input.TextArea
              rows={3}
              placeholder="Enter full address"
              prefix={<EnvironmentOutlined />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UniversityList;
