import React from 'react';
import {
  Layout,
  Grid,
  Button,
  Progress,
  Table,
  Space,
  theme,
  Breadcrumb,
  Card,
  Input,
} from 'antd';
import {
  Folder,
  Upload,
  File,
  FileText,
  Image,
  Download,
  Share2,
  Trash2,
} from 'lucide-react';

const { useBreakpoint } = Grid;
const { Content } = Layout;
const { Search } = Input;

const Documents = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  //dummy data
  const dataSource = [
    {
      key: '1',
      name: 'Document 1.pdf',
      type: 'file',
      size: '1.2 MB',
      date: '2023-10-01',
    },
    {
      key: '2',
      name: 'Folder 1',
      type: 'folder',
      size: '4.5 MB',
      date: '2023-10-02',
    },
    {
      key: '3',
      name: 'Image 1.png',
      type: 'file',
      size: '2.3 MB',
      date: '2023-10-03',
    },
    {
      key: '4',
      name: 'Photo.jpg',
      type: 'file',
      size: '3.1 MB',
      date: '2023-10-04',
    },
  ];
  const totalStorage = '5 GB';
  const sizeUnits = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  const convertToBytes = (size) => {
    const [_, num, unit] = size.match(/([\d.]+)\s*([A-Za-z]+)/) || [];
    return num ? parseFloat(num) * (sizeUnits[unit] || 1) : 0;
  };

  const totalStorageBytes = convertToBytes(totalStorage);
  const usedStorageBytes = dataSource
    .map((item) => convertToBytes(item.size))
    .reduce((acc, val) => acc + val, 0);

  const formatSize = (bytes) => {
    if (bytes >= sizeUnits.TB) return (bytes / sizeUnits.TB).toFixed(2) + ' TB';
    if (bytes >= sizeUnits.GB) return (bytes / sizeUnits.GB).toFixed(2) + ' GB';
    if (bytes >= sizeUnits.MB) return (bytes / sizeUnits.MB).toFixed(2) + ' MB';
    if (bytes >= sizeUnits.KB) return (bytes / sizeUnits.KB).toFixed(2) + ' KB';
    return bytes + ' B';
  };

  const progressPercentage = (
    (usedStorageBytes / totalStorageBytes) *
    100
  ).toFixed(2);

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const renderFileIcon = (filename) => {
    const extension = getFileExtension(filename);

    switch (extension) {
      case 'pdf':
        return <FileText size={18} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image size={18} />;
      case 'txt':
        return <FileText size={18} />;
      default:
        return <File size={18} />;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          {record.type === 'file' ? renderFileIcon(text) : <Folder size={18} />}
          {text}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '18%',
      render: () => (
        <Space>
          <Button type="link" icon={<Download stroke="#1890ff" size={18} />} />
          <Button type="link" icon={<Share2 size={18} />} />
          <Button type="link" danger icon={<Trash2 size={18} />} />
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    console.log('Search value:', value);
  };

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Documents</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          margin: screens.xs ? '0 8px' : '0 16px',
          padding: screens.xs ? 16 : 24,
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <p className="text-2xl font-bold mb-4">Documents</p>
          <Search
            placeholder="Search files/folders"
            onSearch={handleSearch}
            style={{ width: 350 }}
            size="large"
            allowClear
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Card size="small" style={{ width: '30%', height: 96 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Progress
                type="circle"
                percent={progressPercentage}
                size={60}
                strokeColor="#1890ff"
                format={() => (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <File stroke="#1890ff" size={18} className="mt-1" />
                  </div>
                )}
              />
              <div style={{ marginLeft: 16 }}>
                <p className="m-0 text-lg ml-3">Total Storage</p>
                <p className="m-0">
                  <span className="text-lg font-bold">
                    {formatSize(usedStorageBytes)}
                  </span>
                  <span className="mx-1">of</span>
                  <span className="text-lg font-bold">{totalStorage}</span>
                </p>
              </div>
            </div>
          </Card>

          <Space>
            <Button
              size="large"
              type="primary"
              icon={<Upload size={18} className="mt-1" />}
            >
              Upload
            </Button>
            <Button
              size="large"
              type="default"
              icon={<Folder size={18} className="mt-1" />}
            >
              Add Folder
            </Button>
          </Space>
        </div>

        <Table
          rowSelection={{ type: 'checkbox' }}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      </div>
    </Content>
  );
};

export default Documents;
