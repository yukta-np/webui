import { useState, useEffect } from 'react';
import {
  FileOutlined,
  FolderOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Layout,
  List,
  Card,
  Button,
  Dropdown,
  Space,
  Input,
  Breadcrumb,
  Typography,
  Avatar,
  Tooltip,
  Modal,
  Progress,
} from 'antd';
import { File } from 'lucide-react';

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState(['Home']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfoVisible, setFileInfoVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [storageUsed, setStorageUsed] = useState(70); // Example storage used (in percentage)
  const [totalStorage, setTotalStorage] = useState('5 GB'); // Total storage available (in GB, for example)

  // You can calculate the usage percentage based on your actual storage data
  const storagePercentage = (storageUsed / totalStorage) * 100;

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
  const usedStorageBytes = files
    .map((item) => convertToBytes(item.size || '0'))
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

  // Mock API call to fetch data
  const fetchData = async () => {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          files: [
            {
              id: '1',
              name: 'Documents',
              type: 'folder',
              modified: '2023-10-15',
              path: ['Home'],
            },
            {
              id: '2',
              name: 'Work',
              type: 'folder',
              modified: '2023-10-15',
              path: ['Home', 'Documents'],
            },
            {
              id: '10',
              name: 'analytics.py',
              type: 'txt',
              modified: '2023-10-15',
              path: ['Home', 'Documents', 'Work'],
            },
            {
              id: '3',
              name: 'Personal',
              type: 'folder',
              modified: '2023-10-15',
              path: ['Home', 'Documents'],
            },
            {
              id: '4',
              name: 'Images',
              type: 'folder',
              modified: '2023-10-14',
              path: ['Home', 'Documents'],
            },
            {
              id: '5',
              name: 'Project Proposal.docx',
              type: 'doc',
              size: '2.3 MB',
              modified: '2023-10-12',
              path: ['Home', 'Documents', 'Personal'],
            },
            {
              id: '6',
              name: 'Budget.xlsx',
              type: 'excel',
              size: '1.5 MB',
              modified: '2023-10-10',
              path: ['Home', 'Documents', 'Work'],
            },
            {
              id: '7',
              name: 'Presentation.pdf',
              type: 'pdf',
              size: '4.2 MB',
              modified: '2023-10-08',
              path: ['Home', 'Documents', 'Work'],
            },
            {
              id: '8',
              name: 'Profile Picture.jpg',
              type: 'image',
              size: '3.1 MB',
              modified: '2023-10-05',
              path: ['Home', 'Documents', 'Images'],
            },
            {
              id: '9',
              name: 'Notes.txt',
              type: 'text',
              size: '12 KB',
              modified: '2023-10-03',
              path: ['Home', 'Documents', 'Personal'],
            },
            {
              id: '10',
              name: 'vision.txt',
              type: 'text',
              size: '4 KB',
              modified: '2023-10-03',
              path: ['Home'],
            },
          ],
        });
      }, 1000);
    });

    setFiles(response.files);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log({ currentPath });
  }, [currentPath]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'folder':
        return (
          <FolderOutlined style={{ fontSize: '24px', color: '#faad14' }} />
        );
      case 'image':
        return (
          <FileImageOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
        );
      case 'pdf':
        return (
          <FilePdfOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
        );
      case 'doc':
        return (
          <FileWordOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        );
      case 'excel':
        return (
          <FileExcelOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
        );
      case 'text':
        return (
          <FileTextOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
        );
      default:
        return <FileOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />;
    }
  };

  const getFilteredFiles = () => {
    const filtered = files.filter((file) => {
      // Compare paths by joining them into strings for comparison
      return file.path.join('/') === currentPath.join('/');
    });

    console.log(filtered);
    return filtered;
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      // Navigate to the folder, append the folder name to the current path
      console.log('Navigating to: ', [...file.path, file.name]);
      setCurrentPath([...file.path, file.name]); // Navigate to the folder
    } else {
      setSelectedFile(file);
      setFileInfoVisible(true); // Show file info modal
    }
  };

  const handleBreadcrumbClick = (index) => {
    console.log('prev. currentPath: ', currentPath);

    // Slice the path array to get up to the selected index (inclusive)
    const newPath = currentPath.slice(0, index + 1);

    console.log('new path: ', newPath);

    setCurrentPath(newPath); // Update the path to the clicked breadcrumb's path
  };

  const closeAddFolderModal = () => {
    setIsAddFolderModalOpen(false);
    setNewFolderName('');
  };

  const handleFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleAddFolder = () => {
    console.log('currentPath', currentPath);
    console.log(`Creating folder ${newFolderName} on path ${currentPath}`);

    // Create the new folder object
    const newFolder = {
      id: 98, // Generate a new unique ID
      name: newFolderName,
      type: 'folder',
      modified: new Date().toISOString(), // Current time as the modification time
      path: currentPath,
    };

    // Update the files array with the new folder
    setFiles([...files, newFolder]);
    closeAddFolderModal();
  };

  const fileActions = [
    {
      key: '1',
      label: 'Download',
      icon: <DownloadOutlined />,
    },
    {
      key: '2',
      label: 'Share',
      icon: <ShareAltOutlined />,
    },
    {
      key: '3',
      label: 'Info',
      icon: <InfoCircleOutlined />,
      onClick: () => selectedFile && setFileInfoVisible(true),
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          padding: '0 16px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0, marginRight: '24px' }}>
            File Manager
          </Title>
          <Space>
            <Button
              onClick={() => setIsAddFolderModalOpen(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              New Folder
            </Button>
            <Button icon={<UploadOutlined />}>Upload</Button>
            <Button onClick={() => setCurrentPath(['Home'])}>
              Reset State
            </Button>
          </Space>
        </div>
        <Search placeholder="Search files..." style={{ width: 300 }} />
      </Header>

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

      <Layout>
        <Content style={{ padding: '16px', background: '#fff' }}>
          <div
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Breadcrumb>
              {currentPath.map((path, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => handleBreadcrumbClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {path}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>

          {/* Grid View for Files & Folders */}
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 6 }}
            dataSource={getFilteredFiles()}
            renderItem={(file) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  onClick={() => handleFileClick(file)}
                >
                  <div style={{ marginBottom: '8px' }}>
                    {getFileIcon(file.type)}
                  </div>
                  <Tooltip title={file.name}>
                    <Typography.Text
                      ellipsis={{ tooltip: file.name }}
                      style={{ display: 'block' }}
                    >
                      {file.name}
                    </Typography.Text>
                  </Tooltip>
                  <Dropdown
                    menu={{ items: fileActions }}
                    trigger={['contextMenu']}
                  >
                    <div
                      style={{
                        cursor: 'context-menu',
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  </Dropdown>
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>

      <Modal
        title="File Information"
        open={fileInfoVisible}
        onCancel={() => setFileInfoVisible(false)}
        footer={[
          <Button key="close" onClick={() => setFileInfoVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedFile && (
          <div>
            <p>
              <strong>Name:</strong> {selectedFile.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedFile.type.toUpperCase()}
            </p>
            {selectedFile.size && (
              <p>
                <strong>Size:</strong> {selectedFile.size}
              </p>
            )}
            {selectedFile.modified && (
              <p>
                <strong>Last Modified:</strong> {selectedFile.modified}
              </p>
            )}
            <p>
              <strong>Location:</strong> {selectedFile.path.join('/')}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Create New Folder"
        open={isAddFolderModalOpen}
        onCancel={closeAddFolderModal}
        footer={null}
        centered
      >
        <div>
          <Input
            value={newFolderName}
            onChange={handleFolderNameChange}
            placeholder="Enter folder name"
            autoFocus
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={closeAddFolderModal} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              disabled={!newFolderName}
              type="primary"
              onClick={handleAddFolder}
            >
              Create Folder
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
