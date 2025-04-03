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
import { useAcademicPrograms } from '@/hooks/useAcademicPrograms';
import { useAcademicSubjects } from '@/hooks/useAcademicSubjects';
import { Actions } from '@/constants';
import {
  deleteAcademicSubject,
  getAcademicSubjectById,
  updateAcademicSubject,
  createAcademicSubject,
} from '@/services/academicSubjects.http';
import { openNotification } from '@/utils';

const AcademicSubjects = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(Actions.add);
  const [id, setId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const searchInput = useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});

  const { programs } = useAcademicPrograms();
  const { subjects, revalidate } = useAcademicSubjects();
  console.log(programs);

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
      render: (text, subjects) => (
        <a className="text-blue-600" onClick={() => onView(subjects?.id)}>
          {subjects?.displayId}
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
      dataIndex: 'academicProgram',
      key: 'academicProgram',
      render: (_, subjects) => (
        <span>
          {subjects?.academicProgram?.name} (
          {subjects?.academicProgram?.shortName})
        </span>
      ),
      filters: programs?.map((program) => ({
        text: `${program.name} (${program.shortName})`,
        value: program.id,
      })),
      onFilter: (value, record) => {
        return record.academicProgram?.id?.toString() === value.toString();
      },
      filteredValue: filteredInfo.academicProgram || null,
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
            title="Are you sure to delete this subject?"
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

  const onFinish = async (values) => {
    setIsProcessing(true);
    setAction(Actions.add);
    console.log(values);
    try {
      const payload = {
        ...values,
        academicProgramId: Number(values.academicProgramId),
      };
      console.log(payload);

      action === Actions.add
        ? await createAcademicSubject(payload)
        : await updateAcademicSubject(id, payload);
      openNotification(`Subject ${action}ed successfully`);
      revalidate();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      openNotification(`Failed to ${action} subject`, true);
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
      academicProgramId: data?.academicProgram?.id,
    };
    form.setFieldsValue(myData);
  };

  const onEdit = async (id) => {
    setId(id);
    setAction(Actions.edit);
    const { data } = await getAcademicSubjectById(id);
    populateForm(data);
    showModal();
  };

  const onView = async (id) => {
    setAction(Actions.view);
    const { data } = await getAcademicSubjectById(id);
    populateForm(data);
    showModal();
  };

  const onDelete = async (id) => {
    await deleteAcademicSubject(id);
    openNotification('Academic Subject deleted successfully');
    revalidate();
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
        <p className="text-xl font-bold m-0">Academic Subjects</p>

        <Button type="primary" onClick={onAdd}>
          Add New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={subjects}
        bordered
        pagination={{ pageSize: 5 }}
        onChange={(pagination, filters, sorter) => {
          setFilteredInfo(filters);
        }}
      />

      <Modal
        title={
          action === Actions.view
            ? 'Academic Subject Details'
            : action === Actions.add
            ? 'Add Academic Subject'
            : 'Edit Academic Subject'
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
                rules={[{ required: true, message: 'Please input the code!' }]}
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
                name="academicProgramId"
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
                  allowClear
                  placeholder="Select academic program"
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={programs?.map((p) => ({
                    label: p?.name,
                    value: p?.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AcademicSubjects;
