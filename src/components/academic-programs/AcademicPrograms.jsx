import React, { useState, useRef, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Divider,
  Row,
  Col,
  Checkbox,
  Tag,
  Radio,
} from 'antd';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';

const AcademicPrograms = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const searchInput = useRef(null);

  // Mock data - replace with your API calls
  useEffect(() => {
    // Fetch faculties
    setFaculties([
      { id: 1, name: 'Faculty of Engineering' },
      { id: 2, name: 'Faculty of Medicine' },
      { id: 3, name: 'Faculty of Science' },
    ]);

    // Fetch academic programs
    setDataSource([
      {
        key: 'PRG-1',
        name: 'Computer Science',
        shortName: 'CS',
        isYearly: true,
        isSemester: false,
        facultyId: 1,
        facultyName: 'Faculty of Engineering',
      },
      {
        key: 'PRG-2',
        name: 'Medicine',
        shortName: 'MED',
        isYearly: false,
        isSemester: true,
        facultyId: 2,
        facultyName: 'Faculty of Medicine',
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
    },
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      key: 'shortName',
      ...getColumnSearchProps('shortName'),
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        <>
          {record.isYearly && <Tag color="blue">Yearly</Tag>}
          {record.isSemester && <Tag color="green">Semester</Tag>}
        </>
      ),
      filters: [
        { text: 'Yearly', value: 'yearly' },
        { text: 'Semester', value: 'semester' },
      ],
      onFilter: (value, record) =>
        value === 'yearly' ? record.isYearly : record.isSemester,
    },
    {
      title: 'Faculty',
      dataIndex: 'facultyName',
      key: 'facultyName',
      ...getColumnSearchProps('facultyName'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FilePenLine size={18} />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete this program?"
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
    setEditingProgram(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log(values);
    setIsModalVisible(false);
    setEditingProgram(null);
    form.resetFields();
  };

  const onEdit = (record) => {
    form.setFieldsValue({
      ...record,
      facultyId: record.facultyId,
    });
    setEditingProgram(record);
    setIsModalVisible(true);
  };

  const onDelete = (record) => {
    setDataSource((prev) => prev.filter((item) => item.key !== record.key));
    message.success('Program deleted successfully');
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
        }}
      >
        <p className="text-xl font-bold m-0">Academic Programs</p>
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
        title={
          editingProgram ? 'Edit Academic Program' : 'Add Academic Program'
        }
        visible={isModalVisible}
        onCancel={onCancel}
        onOk={() => form.submit}
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
                label="Program Name"
                rules={[
                  { required: true, message: 'Please input program name!' },
                ]}
              >
                <Input placeholder="Enter program name" />
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
            <Col span={24}>
              <Form.Item
                name="facultyId"
                label="Faculty"
                rules={[{ required: true, message: 'Please select faculty!' }]}
              >
                <Select
                  showSearch
                  placeholder="Select faculty"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {faculties.map((faculty) => (
                    <Select.Option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="programType"
                rules={[
                  { required: true, message: 'Please select program type!' },
                ]}
              >
                <Radio.Group>
                  <Radio value="yearly">Yearly </Radio>
                  <Radio value="semester">Semester </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AcademicPrograms;
