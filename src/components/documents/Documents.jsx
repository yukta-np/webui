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
  Popconfirm,
  Row,
  Col,
  Dropdown,
  Menu,
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
  List,
  Grid as GridIcon,
  MoreVertical,
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
  const [viewMode, setViewMode] = useState('list'); // State for view mode (list or icon)

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

  // Render file icon with custom size
  const renderFileIcon = (filename, size = 18) => {
    const extension = getFileExtension(filename);

    switch (extension) {
      case 'pdf':
        return <FileText size={size} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image size={size} />;
      case 'txt':
        return <FileText size={size} />;
      default:
        return <File size={size} />;
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
          {record.type === 'file' ? (
            renderFileIcon(text, 18) // Use smaller icon size for List View
          ) : (
            <Folder size={18} />
          )}
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

  // Action menu for icon view
  const actionMenu = (record) => (
    <Menu>
      <Menu.Item key="download" icon={<Download size={16} />}>
        Download
      </Menu.Item>
      <Menu.Item key="share" icon={<Share2 size={16} />}>
        Share
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => {
          // Handle delete action
          console.log('Delete:', record.name);
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Render files/folders in icon view
  const renderIconView = () => {
    const data = getCurrentFolderData();
    return (
      <Row gutter={[16, 16]}>
        {data.map((item) => (
          <Col key={item.key} xs={12} sm={8} md={6} lg={4} xl={3}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 16, // Increased padding
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                cursor: 'pointer',
                position: 'relative',
                height: '100%', // Ensure all items have the same height
              }}
              onClick={() => {
                if (item.type === 'folder') {
                  handleFolderClick(item);
                }
              }}
            >
              {/* File/Folder Icon */}
              {item.type === 'file' ? (
                renderFileIcon(item.name, 48) // Use larger icon size for Icon View
              ) : (
                <Folder size={48} /> // Increased icon size
              )}

              {/* Name and Size */}
              <p style={{ marginTop: 8, marginBottom: 0 }}>{item.name}</p>
              <p style={{ fontSize: 12, color: '#666' }}>{item.size}</p>

              {/* Action Menu (3 vertical dots) */}
              <Dropdown overlay={actionMenu(item)} trigger={['click']}>
                <Button
                  type="text"
                  icon={<MoreVertical size={16} />}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent folder navigation
                />
              </Dropdown>
            </div>
          </Col>
        ))}
      </Row>
    );
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

        {/* Tabs with View Toggle Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Tabs defaultActiveKey="myFiles">
            <TabPane tab="My Files" key="myFiles" />
            <TabPane tab="Shared Files" key="sharedFiles" />
          </Tabs>
          <Button
            type="default"
            icon={
              viewMode === 'list' ? <GridIcon size={18} /> : <List size={18} />
            }
            onClick={() => setViewMode(viewMode === 'list' ? 'icon' : 'list')}
          >
            {viewMode === 'list' ? 'Icon View' : 'List View'}
          </Button>
        </div>

        {/* Content based on View Mode */}
        {viewMode === 'list' ? (
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
        ) : (
          renderIconView()
        )}

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
