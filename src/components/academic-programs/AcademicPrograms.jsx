import React, { useState, useRef } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Divider,
  Row,
  Col,
  Tag,
  Radio,
} from 'antd';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';
import { useFaculties } from '@/hooks/useFaculties';
import { Actions } from '@/constants';
import {
  createAcademicProgram,
  deleteAcademicProgram,
  getAcademicProgramById,
  updateAcademicProgram,
} from '@/services/academicPrograms.http';
import { openNotification } from '@/utils';
import { useAcademicPrograms } from '@/hooks/useAcademicPrograms';

const AcademicPrograms = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(Actions.add);
  const [id, setId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const searchInput = useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});

  const { faculties } = useFaculties();
  const { programs, isLoading, isError, revalidate } = useAcademicPrograms();
  console.log(faculties);

  const onSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const onReset = (dataIndex) => {
    setFilteredInfo((prev) => ({
      ...prev,
      [dataIndex]: null,
    }));
  };

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
      dataIndex: 'key',
      key: 'key',
      sorter: true,
      render: (text, faculties) => (
        <a className="text-blue-600" onClick={() => onView(faculties?.id)}>
          {faculties?.displayId}
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
      render: (_, programs) => programs?.faculty?.name,
      ...getColumnSearchProps('facultyName'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<FilePenLine size={18} />}
            onClick={() => onEdit(record.id)}
          />
          <Popconfirm
            title="Are you sure to delete this program?"
            okText="Yes"
            cancelText="No"
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

  const onFinish = (values) => {
    setIsProcessing(true);
    setAction(Actions.add);
    try {
      const { programType, ...rest } = values;
      const payload = {
        ...rest,
        facultyId: Number(values.facultyId),
        isYearly: programType === 'yearly',
        isSemester: programType === 'semester',
      };
      console.log(payload);

      action === Actions.add
        ? createAcademicProgram(payload)
        : updateAcademicProgram(id, payload);
      openNotification(`Program ${action}ed successfully`);
      revalidate();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      openNotification(`Failed to ${action} program`, true);
      console.error('Validation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onAdd = () => {
    setAction(Actions.add);
    form.resetFields();
    showModal();
  };

  const populateForm = async (data) => {
    const myData = {
      ...data,
      facultyId: data?.faculty?.id,
    };
    form.setFieldsValue(myData);
  };

  const onEdit = async (id) => {
    setId(id);
    setAction(Actions.edit);
    const { data } = await getAcademicProgramById(id);
    populateForm(data);
    showModal();
  };

  const onView = async (id) => {
    setAction(Actions.view);
    const { data } = await getAcademicProgramById(id);
    populateForm(data);
    showModal();
  };

  const onDelete = async (id) => {
    await deleteAcademicProgram(id);
    openNotification('Academic Program deleted successfully');
    revalidate();
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
        <Button type="primary" onClick={onAdd}>
          Add New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={programs}
        bordered
        pagination={{ pageSize: 5 }}
        onChange={(pagination, filters, sorter) => {
          setFilteredInfo(filters);
        }}
      />

      <Modal
        title={
          action === Actions.view
            ? 'Academic Program Details'
            : action === Actions.add
            ? 'Add Academic Program'
            : 'Edit Academic Program'
        }
        open={isModalVisible}
        onCancel={closeModal}
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
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={faculties?.map((faculty) => ({
                    label: faculty.name,
                    value: faculty.id,
                  }))}
                />
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
