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
} from 'antd';
import { FilePenLine, Trash2Icon, Search } from 'lucide-react';
import { useUniversities } from '@/hooks/useUniversities';
import { useFaculties } from '@/hooks/useFaculties';
import { Actions } from '@/constants';
import {
  createFaculty,
  deleteFaculty,
  getFacultyById,
  updateFaculty,
} from '@/services/faculties.http';
import { cl, openNotification } from '@/utils';

const FacultyList = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(Actions.add);
  const [id, setId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});

  const { universities } = useUniversities();
  const { faculties, isLoading, isError, revalidate } = useFaculties();

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
      render: (_, faculties) => (
        <a className="text-blue-600" onClick={() => onView(faculties?.id)}>
          {faculties?.displayId}
        </a>
      ),
    },
    {
      title: 'Faculty Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: true,
    },
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      key: 'shortName',
    },
    {
      title: 'University',
      dataIndex: 'university',
      key: 'university',
      render: (_, faculties) => faculties?.university?.name,
      ...getColumnSearchProps('university'),
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
            title="Are you sure to delete this faculty?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
          >
            <Button
              type="link"
              danger
              icon={<Trash2Icon stroke="red" size={18} />}
            />
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
    try {
      const { universityId, ...rest } = values;
      console.log(values);
      const payload = {
        ...rest,
        universitiesId: Number(universityId),
      };

      action === Actions.add
        ? await createFaculty(payload)
        : await updateFaculty(id, payload);
      openNotification(`Faculty ${action}ed successfully`);
      revalidate();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      openNotification(`Failed to ${action} faculty`, true);
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
      universityId: data?.university?.id,
    };
    form.setFieldsValue(myData);
  };

  const onEdit = async (id) => {
    setId(id);
    setAction(Actions.edit);
    const { data } = await getFacultyById(id);
    populateForm(data);
    showModal();
  };

  const onView = async (id) => {
    setAction(Actions.view);
    const { data } = await getFacultyById(id);
    populateForm(data);
    showModal();
  };

  const onDelete = async (id) => {
    await deleteFaculty(id);
    openNotification('Faculty deleted successfully');
    revalidate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold m-0">Faculties</p>
        <Button type="primary" onClick={onAdd}>
          Add New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={faculties}
        bordered
        pagination={{ pageSize: 5 }}
        onChange={(pagination, filters, sorter) => {
          setFilteredInfo(filters);
        }}
      />
      <Modal
        title={
          action === Actions.view
            ? 'Faculty Details'
            : action === Actions.add
            ? 'Add Faculty'
            : 'Edit Faculty'
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
          <Form.Item
            label="Faculty Name"
            name="name"
            rules={[{ required: true, message: 'Please input faculty name!' }]}
          >
            <Input placeholder="Enter faculty name" />
          </Form.Item>

          <Form.Item
            label="Short Name"
            name="shortName"
            rules={[
              { required: true, message: 'Please input short name!' },
              { max: 10, message: 'Short name must be maximum 10 characters!' },
            ]}
          >
            <Input placeholder="Enter short name" />
          </Form.Item>

          <Form.Item
            label="University"
            name="universityId"
            rules={[{ required: true, message: 'Please select university!' }]}
          >
            <Select
              showSearch
              placeholder="Select university"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              options={universities?.map((university) => ({
                value: university.id,
                label: university.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FacultyList;
