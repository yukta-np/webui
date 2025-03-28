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
} from 'antd';

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

export default function FileManager() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfoVisible, setFileInfoVisible] = useState(false);
  const [files, setFiles] = useState([]);

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
              path: '',
            },
            {
              id: '2',
              name: 'Work',
              type: 'folder',
              modified: '2023-10-15',
              path: '/Documents',
            },
            {
              id: '10',
              name: 'analytics.py',
              type: 'txt',
              modified: '2023-10-15',
              path: '/Documents/Work',
            },
            {
              id: '3',
              name: 'Personal',
              type: 'folder',
              modified: '2023-10-15',
              path: '/Documents',
            },
            {
              id: '4',
              name: 'Images',
              type: 'folder',
              modified: '2023-10-14',
              path: '/Documents',
            },
            {
              id: '5',
              name: 'Project Proposal.docx',
              type: 'doc',
              size: '2.3 MB',
              modified: '2023-10-12',
              path: '/Documents/Personal',
            },
            {
              id: '6',
              name: 'Budget.xlsx',
              type: 'excel',
              size: '1.5 MB',
              modified: '2023-10-10',
              path: '/Documents/Work',
            },
            {
              id: '7',
              name: 'Presentation.pdf',
              type: 'pdf',
              size: '4.2 MB',
              modified: '2023-10-08',
              path: '/Documents/Work',
            },
            {
              id: '8',
              name: 'Profile Picture.jpg',
              type: 'image',
              size: '3.1 MB',
              modified: '2023-10-05',
              path: '/Documenets/Images',
            },
            {
              id: '9',
              name: 'Notes.txt',
              type: 'text',
              size: '12 KB',
              modified: '2023-10-03',
              path: '/Documents/Personal',
            },
            {
              id: '10',
              name: 'vision.txt',
              type: 'text',
              size: '4 KB',
              modified: '2023-10-03',
              path: '',
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
    const filtered = files.filter((file) => file.path === currentPath);

    console.log(filtered);
    return filtered;
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      console.log('Navigating to: ', `${file.path}/${file.name}`);
      setCurrentPath(`${file.path}/${file.name}`); // Navigate to the folder
    } else {
      setSelectedFile(file);
      setFileInfoVisible(true); // Show file info modal
    }
  };

  const handleBreadcrumbClick = (path) => {
    // TODO: fix this bug
    setCurrentPath(`/${path}`);
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
            <Button type="primary" icon={<PlusOutlined />}>
              New
            </Button>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Space>
        </div>
        <Search placeholder="Search files..." style={{ width: 300 }} />
      </Header>
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
              {currentPath.split('/').map((path, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={handleBreadcrumbClick}
                  style={{ cursor: 'pointer' }}
                >
                  {path}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>

          {/* Grid View for Files */}
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
              <strong>Location:</strong> {selectedFile.path}
            </p>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
