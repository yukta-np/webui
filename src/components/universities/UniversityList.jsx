import React, { useState, useRef, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Row,
  Col,
  DatePicker,
  Tag,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  ContactsOutlined,
  MailOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';

const UniversityList = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const searchInput = useRef(null);

  // Mock data - replace with API calls
  useEffect(() => {
    setDataSource([
      {
        key: 'UNI-1',
        name: 'Harvard University',
        shortName: 'Harvard',
        website: 'https://www.harvard.edu',
        address: 'Cambridge, MA 02138, USA',
        contact: '+1 617-495-1000',
        email: 'contact@harvard.edu',
        established: '1636-09-08',
      },
      {
        key: 'UNI-2',
        name: 'Stanford University',
        shortName: 'Stanford',
        website: 'https://www.stanford.edu',
        address: 'Stanford, CA 94305, USA',
        contact: '+1 650-723-2300',
        email: 'admission@stanford.edu',
        established: '1891-10-01',
      },
    ]);
  }, []);

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
            onClick={() => onReset(clearFilters)}
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
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      render: (text, record) => (
        <a className="text-blue-600" onClick={() => onView(record)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      key: 'shortName',
      ...getColumnSearchProps('shortName'),
    },
    {
      title: 'Contact Info',
      key: 'contactInfo',
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
      title: 'Location',
      key: 'location',
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
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this university?"
            onConfirm={() => onDelete(record)}
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

  const onCancel = () => {
    setIsModalVisible(false);
    setEditingUniversity(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      established: values.established.format('YYYY-MM-DD'),
    };

    if (editingUniversity) {
      // Update existing university
      setDataSource((prev) =>
        prev.map((item) =>
          item.key === editingUniversity.key
            ? { ...item, ...formattedValues }
            : item
        )
      );
      message.success('University updated successfully');
    } else {
      // Add new university
      const newUniversity = {
        key: Date.now().toString(),
        ...formattedValues,
      };
      setDataSource((prev) => [...prev, newUniversity]);
      message.success('University added successfully');
    }
    onCancel();
  };

  const onEdit = (record) => {
    form.setFieldsValue({
      ...record,
      established: moment(record.established),
    });
    setEditingUniversity(record);
    setIsModalVisible(true);
  };

  const onDelete = (record) => {
    setDataSource((prev) => prev.filter((item) => item.key !== record.key));
    message.success('University deleted successfully');
  };

  const onSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const onReset = (clearFilters) => {
    clearFilters();
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
        <Button type="primary" onClick={showModal}>
          Add New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUniversity ? 'Edit University' : 'Add New University'}
        visible={isModalVisible}
        onCancel={onCancel}
        onOk={() => form.submit}
        width={700}
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="University Name"
                rules={[
                  { required: true, message: 'Please input university name!' },
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
                  {
                    validator: (_, value) => {
                      if (editingUniversity) return Promise.resolve();
                      if (dataSource.some((item) => item.email === value)) {
                        return Promise.reject(
                          'This email is already registered!'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
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
