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
  Row,
  Col,
  Divider,
} from 'antd';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';

const AcademicSubjects = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [academicPrograms, setAcademicPrograms] = useState([]);
  const searchInput = useRef(null);

  // Mock data - replace with your API calls
  useEffect(() => {
    // Fetch academic programs for the dropdown
    setAcademicPrograms([
      { id: 1, name: 'Computer Science', code: 'CS' },
      { id: 2, name: 'Electrical Engineering', code: 'EE' },
      { id: 3, name: 'Business Administration', code: 'BA' },
    ]);

    // Fetch initial data
    setDataSource([
      {
        key: 'SUB-1',
        name: 'Software Engineering Track',
        code: 'SE-TRACK',
        shortName: 'SET',
        AcademicProgramId: 1,
        academicProgram: { id: 1, name: 'Computer Science', code: 'CS' },
      },
      {
        key: 'SUB-2',
        name: 'Power Systems Specialization',
        code: 'PS-SPEC',
        shortName: 'PSS',
        AcademicProgramId: 2,
        academicProgram: { id: 2, name: 'Electrical Engineering', code: 'EE' },
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
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      key: 'shortName',
      ...getColumnSearchProps('shortName'),
    },
    {
      title: 'Academic Program',
      dataIndex: ['academicProgram', 'name'],
      key: 'academicProgram',
      render: (_, record) => (
        <span>
          {record.academicProgram?.name} ({record.academicProgram?.code})
        </span>
      ),
      filters: academicPrograms.map((program) => ({
        text: `${program.name} (${program.code})`,
        value: program.id,
      })),
      onFilter: (value, record) => record.AcademicProgramId === value,
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
            title="Are you sure to delete this record?"
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
    setEditingRecord(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const academicProgram = academicPrograms.find(
      (p) => p.id === values.AcademicProgramId
    );

    if (editingRecord) {
      // Update existing record
      setDataSource((prev) =>
        prev.map((item) =>
          item.key === editingRecord.key
            ? {
                ...item,
                ...values,
                academicProgram,
              }
            : item
        )
      );
      message.success('Record updated successfully');
    } else {
      // Add new record
      const newRecord = {
        key: Date.now().toString(),
        ...values,
        academicProgram,
      };
      setDataSource((prev) => [...prev, newRecord]);
      message.success('Record added successfully');
    }
    onCancel();
  };

  const onEdit = (record) => {
    form.setFieldsValue({
      ...record,
      AcademicProgramId: record.AcademicProgramId,
    });
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const onDelete = (record) => {
    setDataSource((prev) => prev.filter((item) => item.key !== record.key));
    message.success('Record deleted successfully');
  };

  const onSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const onReset = (clearFilters) => {
    clearFilters();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p className="text-xl font-bold m-0">Academic Subjects</p>

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
        title={editingRecord ? 'Edit Record' : 'Add New Record'}
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
                label="Name"
                rules={[{ required: true, message: 'Please input the name!' }]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Code"
                rules={[
                  { required: true, message: 'Please input the code!' },
                  {
                    validator: (_, value) => {
                      if (editingRecord) return Promise.resolve();
                      if (dataSource.some((item) => item.code === value)) {
                        return Promise.reject('This code already exists!');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Enter unique code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item
                name="AcademicProgramId"
                label="Academic Program"
                rules={[
                  {
                    required: true,
                    message: 'Please select academic program!',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select academic program"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {academicPrograms.map((program) => (
                    <Select.Option key={program.id} value={program.id}>
                      {program.name} ({program.code})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AcademicSubjects;
