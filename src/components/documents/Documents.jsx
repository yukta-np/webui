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
  Radio,
  Switch,
  Form,
  Select,
  Avatar,
  message,
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
import { useUsers } from '@/hooks/useUsers';

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const [viewMode, setViewMode] = useState('menu');
  const [selectedItem, setSelectedItem] = useState(null);
  const [myFilesDataSource, setMyFilesDataSource] = useState([
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
  ]);
  const [sharedFilesDataSource, setSharedFilesDataSource] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const { users } = useUsers();

  const totalStorage = '5 GB';
  const sizeUnits = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
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
            renderFileIcon(text, 18)
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
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<Download stroke="#1890ff" size={18} />} />
          <Button
            type="link"
            icon={
              <Share2
                stroke="#808080"
                onClick={() => openShareModal(record)}
                size={18}
              />
            }
          />
          <Popconfirm
            title="Delete the file"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger icon={<Trash2 size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

  const handleSearch = (value) => {
    console.log('Search value:', value);
  };

  const openAddFolderModal = () => {
    setIsAddFolderModalOpen(true);
  };

  const closeAddFolderModal = () => {
    setIsAddFolderModalOpen(false);
    setNewFolderName('');
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      message.error('Folder name cannot be empty!');
      return;
    }
    const newFolder = {
      key: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      size: '0 B',
      date: new Date().toISOString().split('T')[0],
      children: [],
    };

    if (currentFolder) {
      // Add the new folder to the current folder's children
      const updatedCurrentFolder = {
        ...currentFolder,
        children: [...currentFolder.children, newFolder],
      };
      setMyFilesDataSource((prev) =>
        prev.map((item) =>
          item.key === currentFolder.key ? updatedCurrentFolder : item
        )
      );
    } else {
      // Add the new folder to the root
      setMyFilesDataSource([...myFilesDataSource, newFolder]);
    }

    closeAddFolderModal();
    message.success('Folder created successfully!');
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUpload = (file) => {
    const newFile = {
      key: `file-${Date.now()}`,
      name: file.name,
      type: 'file',
      size: `${(file.size / 1024).toFixed(2)} KB`,
      date: new Date().toISOString().split('T')[0],
    };

    if (currentFolder) {
      // Add the new file to the current folder's children
      const updatedCurrentFolder = {
        ...currentFolder,
        children: [...currentFolder.children, newFile],
      };
      setMyFilesDataSource((prev) =>
        prev.map((item) =>
          item.key === currentFolder.key ? updatedCurrentFolder : item
        )
      );
    } else {
      // Add the new file to the root
      setMyFilesDataSource([...myFilesDataSource, newFile]);
    }

    closeUploadModal();
    message.success('File uploaded successfully!');
  };

  const openShareModal = (item) => {
    setSelectedItem(item);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleShare = () => {
    if (!selectedItem) return;
    setSharedFilesDataSource([...sharedFilesDataSource, selectedItem]);
    setMyFilesDataSource((prev) =>
      prev.filter((item) => item.key !== selectedItem.key)
    );
    closeShareModal();
    message.success('File shared successfully!');
  };

  const handleDelete = (item) => {
    if (currentFolder) {
      // Delete the item from the current folder's children
      const updatedCurrentFolder = {
        ...currentFolder,
        children: currentFolder.children.filter(
          (child) => child.key !== item.key
        ),
      };
      setMyFilesDataSource((prev) =>
        prev.map((folder) =>
          folder.key === currentFolder.key ? updatedCurrentFolder : folder
        )
      );
    } else {
      // Delete the item from the root
      setMyFilesDataSource((prev) =>
        prev.filter((folder) => folder.key !== item.key)
      );
    }
    message.success('Item deleted successfully!');
  };

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
                padding: 16,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                cursor: 'pointer',
                position: 'relative',
                height: '100%',
              }}
              onClick={() => {
                if (item.type === 'folder') {
                  handleFolderClick(item);
                }
              }}
            >
              {item.type === 'file' ? (
                renderFileIcon(item.name, 48)
              ) : (
                <Folder size={48} />
              )}

              <p style={{ marginTop: 8, marginBottom: 0 }}>{item.name}</p>
              <p style={{ fontSize: 12, color: '#666' }}>{item.size}</p>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="share"
                      icon={<Share2 size={16} />}
                      onClick={(e) => {
                        e.domEvent.stopPropagation();
                        openShareModal(item);
                      }}
                    >
                      Share
                    </Menu.Item>
                    <Menu.Item
                      key="download"
                      icon={<Download size={16} />}
                      onClick={(e) => {
                        e.domEvent.stopPropagation();
                        console.log('Download:', item.name);
                      }}
                    >
                      Download
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      icon={<Trash2 size={16} />}
                      danger
                      onClick={(e) => {
                        e.domEvent.stopPropagation();
                        handleDelete(item);
                      }}
                    >
                      Delete
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <Button
                  type="text"
                  icon={<MoreVertical size={16} />}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
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
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <Radio.Button value="list">
              <List className="mt-1" size={18} />
            </Radio.Button>
            <Radio.Button value="icon">
              <GridIcon className="mt-1" size={18} />
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Content based on View Mode */}
        {viewMode === 'menu' ? (
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
              <Button key="submit" type="primary" onClick={handleAddFolder}>
                Add
              </Button>
            </>,
          ]}
        >
          <Input
            className="mt-3 mb-3"
            placeholder="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
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
          <Dragger
            style={{ marginTop: '20px' }}
            beforeUpload={(file) => {
              handleUpload(file);
              return false; // Prevent default upload behavior
            }}
          >
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

        {/* Share Modal */}
        <Modal
          title={<p className="text-xl">Share Document</p>}
          open={isShareModalOpen}
          onCancel={closeShareModal}
          footer={[
            <>
              <Divider />
              <Button key="cancel" onClick={closeShareModal}>
                Cancel
              </Button>
              <Button key="submit" type="primary" onClick={handleShare}>
                Share
              </Button>
            </>,
          ]}
        >
          <Divider />
          {selectedItem && (
            <p className="text-md font-semibold mt-1">{selectedItem.name}</p>
          )}
          <Form>
            <Form.Item className="mt-5">
              <p className="mb-2">Share with Everyone</p>
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item>
              <p className="mb-1">Share with Users</p>
              <Select
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                optionLabelProp="label"
                mode="multiple"
              >
                {users?.map((u) => (
                  <Option key={u?.id} value={u?.id} label={`${u?.fullName}`}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar src={u?.avatar} style={{ marginRight: 8 }}>
                        {u?.fullName
                          ?.split(' ')
                          .map((name) => name[0].toUpperCase())
                          .join('')}
                      </Avatar>
                      <span>{`${u?.fullName} `}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <p className="mb-1">Share with Groups</p>
              <Select mode="multiple">
                <Select.Option value="group1">Group 1</Select.Option>
                <Select.Option value="group2">Group 2</Select.Option>
                <Select.Option value="group3">Group 3</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <p className="mb-1">Black List (Don't share with)</p>
              <Select mode="multiple">
                <Select.Option value="role1">Role 1</Select.Option>
                <Select.Option value="role2">Role 2</Select.Option>
                <Select.Option value="role3">Role 3</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Content>
  );
};

export default Documents;
