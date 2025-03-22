import React, { useState } from 'react';
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
  Modal,
  Tabs,
  Divider,
  Upload,
  message,
  Popconfirm,
} from 'antd';
import {
  Folder,
  Upload as UploadIcon,
  File,
  FileText,
  Image,
  Download,
  Share2,
  Trash2,
  ArrowLeft,
  Inbox,
} from 'lucide-react';

const { useBreakpoint } = Grid;
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const { Dragger } = Upload;

const Documents = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderStack, setFolderStack] = useState([]);

  // Dummy data for My Files
  const myFilesDataSource = [
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
      children: [
        {
          key: '2-1',
          name: 'Nested Document 1.pdf',
          type: 'file',
          size: '1.1 MB',
          date: '2023-10-03',
        },
      ],
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
  const usedStorageBytes = myFilesDataSource
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

  const handleFolderClick = (folder) => {
    setFolderStack([...folderStack, currentFolder]);
    setCurrentFolder(folder);
  };

  const handleGoBack = () => {
    const parentFolder = folderStack.pop();
    setCurrentFolder(parentFolder);
    setFolderStack([...folderStack]);
  };

  const getCurrentFolderData = () => {
    return currentFolder ? currentFolder.children : myFilesDataSource;
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
          <Button type="link" icon={<Share2 stroke="#808080" size={18} />} />
          <Popconfirm
            title="Delete the file"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<Trash2 size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    console.log('Search value:', value);
  };

  const openAddFolderModal = () => {
    setIsAddFolderModalOpen(true);
  };

  const closeAddFolderModal = () => {
    setIsAddFolderModalOpen(false);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Documents</Breadcrumb.Item>
        {currentFolder && (
          <Breadcrumb.Item>{currentFolder.name}</Breadcrumb.Item>
        )}
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
              icon={<UploadIcon size={18} className="mt-1" />}
              onClick={openUploadModal}
            >
              Upload
            </Button>
            <Button
              size="large"
              type="default"
              icon={<Folder size={18} className="mt-1" />}
              onClick={openAddFolderModal}
            >
              Add Folder
            </Button>
          </Space>
        </div>

        {currentFolder && (
          <Button
            type="default"
            icon={<ArrowLeft size={18} />}
            onClick={handleGoBack}
            style={{ marginBottom: 16 }}
          >
            Back
          </Button>
        )}

        <Tabs defaultActiveKey="myFiles">
          <TabPane tab="My Files" key="myFiles">
            <Table
              rowSelection={{ type: 'checkbox' }}
              dataSource={getCurrentFolderData()}
              columns={columns}
              pagination={false}
              rowKey="key"
              onRow={(record) => ({
                onClick: () => {
                  if (record.type === 'folder') {
                    handleFolderClick(record);
                  }
                },
              })}
            />
          </TabPane>
          <TabPane tab="Shared Files" key="sharedFiles">
            <Table
              rowSelection={{ type: 'checkbox' }}
              dataSource={[]}
              columns={columns}
              pagination={false}
              rowKey="key"
            />
          </TabPane>
        </Tabs>

        {/* Add Folder Modal */}
        <Modal
          title="Add Folder"
          open={isAddFolderModalOpen}
          onCancel={closeAddFolderModal}
          footer={[
            <>
              <Divider />
              <Button key="cancel" onClick={closeAddFolderModal}>
                Cancel
              </Button>
              <Button key="submit" type="primary" onClick={closeAddFolderModal}>
                Add
              </Button>
            </>,
          ]}
        >
          <Input className="mt-3 mb-3" placeholder="Folder Name" />
        </Modal>

        {/* Upload Modal */}
        <Modal
          title="Upload Files"
          open={isUploadModalOpen}
          onCancel={closeUploadModal}
          footer={[
            <>
              <Divider />
              <Button key="cancel" onClick={closeUploadModal}>
                Cancel
              </Button>
              <Button key="submit" type="primary" onClick={closeUploadModal}>
                Upload
              </Button>
            </>,
          ]}
        >
          <Dragger style={{ marginTop: '20px' }}>
            <p className="ant-upload-drag-icon">
              <Inbox
                size={30}
                className="mx-auto"
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            </p>
            <p className="ant-upload-text">
              Click or drag files to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Dragger>
        </Modal>
      </div>
    </Content>
  );
};

export default Documents;
