import { useState, useEffect } from 'react';
import {
  FileOutlined,
  FolderOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  PlusOutlined,
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
  Tooltip,
  Modal,
  Progress,
  Carousel,
  Menu,
} from 'antd';
import { Eye, File, Info, Share2, Trash2 } from 'lucide-react';
import { useFiles } from '@/hooks/useFiles';
import { createFolder, deleteFile } from '@/services/files.http';
import CustomUpload from './CustomUpload';
import Image from 'next/image';

const { Header, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState(['Home']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [myFiles, setMyFiles] = useState([]);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const { filesList, revalidate } = useFiles();

  const [storageUsed, setStorageUsed] = useState(70);
  const [totalStorage, setTotalStorage] = useState('5 GB');

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
  const usedStorageBytes = myFiles
    .map((item) =>
      convertToBytes(item.sizeInByte ? `${item.sizeInByte} B` : '0')
    )
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

  useEffect(() => {
    console.log(filesList);
    if (filesList && filesList.length > 0) {
      console.log(filesList);
      setMyFiles(filesList);
    }
  }, [filesList]);

  useEffect(() => {
    console.log(uploadStatus);
    if (uploadStatus === 'success') {
      revalidate();
      setUploadStatus(null);
    }
  }, [uploadStatus]);

  const getFileIcon = (type, isFolder) => {
    if (isFolder) {
      return <FolderOutlined style={{ fontSize: '24px', color: '#faad14' }} />;
    }

    switch (type) {
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/gif':
      case 'image/bmp':
      case 'image/webp':
        return (
          <FileImageOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
        );

      case 'application/pdf':
        return (
          <FilePdfOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
        );

      case 'application/msword':
      case 'application/vnd.openxmlformats-officefile.wordprocessingml.file':
        return (
          <FileWordOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        );

      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officefile.spreadsheetml.sheet':
        return (
          <FileExcelOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
        );

      case 'text/plain':
        return (
          <FileTextOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
        );

      default:
        return <FileOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />;
    }
  };

  const getFilteredFiles = () => {
    console.log(myFiles);
    const filtered = myFiles.filter((file) => {
      return file.path.join('/') === currentPath.join('/');
    });

    console.log(filtered);
    return filtered;
  };

  const onFileClick = (file) => {
    if (file.isFolder) {
      // Navigate to the folder, append the folder name to the current path
      console.log('Navigating to: ', [...file.path, file.name]);
      setCurrentPath([...file.path, file.name]); // Navigate to the folder
    } else {
      setSelectedFile(file);
      setIsCarouselModalOpen(true);
    }
  };

  const onBreadcrumbClick = (index) => {
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

  const onFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const closeCarouselModal = () => {
    setIsCarouselModalOpen(false);
  };

  const onAddFolder = async () => {
    console.log('currentPath', currentPath);
    console.log(`Creating folder ${newFolderName} on path ${currentPath}`);

    // Create the new folder object
    const newFolder = {
      batchId: 'c62ac9e3-b939-46d8-97c0-9d07b2befb81',
      name: newFolderName,
      isFolder: true,
      path: currentPath,
    };

    try {
      setMyFiles([...myFiles, newFolder]);
      closeAddFolderModal();

      const res = await createFolder(newFolder);
      console.log(res);
    } catch (error) {
      console.log(error);

      setMyFiles(myFiles.slice(0, -1)); // remove the  last added folder
    }
  };

  const fileActions = [
    {
      key: '1',
      label: 'View',
      icon: <Eye size={20} />,
      onClick: (file) => {
        onFileClick(file);
      },
    },
    {
      key: '2',
      label: 'Share',
      icon: <Share2 size={20} />,
      onClick: () => console.log(`shall handle click on Share`),
    },
    {
      key: '3',
      label: 'Info',
      icon: <Info size={20} />,
      onClick: () => console.log(`shall handle click on Info`),
    },
    {
      key: '4',
      label: 'Delete',
      icon: <Trash2 size={20} />,
      onClick: async (file) => {
        try {
          await deleteFile(file.id);
          setMyFiles(myFiles.filter((f) => f.id !== file.id));
        } catch (error) {
          console.log(error);
        }
      },
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

          <Search placeholder="Search files..." style={{ width: 300 }} />
        </div>
      </Header>

      <Layout style={{ padding: '16px', background: '#fff' }}>
        <aside
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
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
              onClick={() => setIsAddFolderModalOpen(true)}
              type="outline"
              icon={<PlusOutlined />}
            >
              New Folder
            </Button>
            <CustomUpload
              filesToUpload={filesToUpload}
              setFilesToUpload={setFilesToUpload}
              setUploadStatus={setUploadStatus}
              currentPath={currentPath}
            />
          </Space>
        </aside>

        <Content>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            className="mt-4 mb-6"
          >
            <Breadcrumb>
              {currentPath.map((path, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => onBreadcrumbClick(index)}
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
              <List.Item className="relative">
                <Card
                  className="file-card"
                  hoverable
                  style={{ textAlign: 'center' }}
                  onClick={() => onFileClick(file)}
                >
                  <div style={{ marginBottom: '8px' }}>
                    {getFileIcon(file.mimeType, file.isFolder)}
                  </div>
                  <Typography.Text
                    ellipsis={{ tooltip: file.name }}
                    style={{ display: 'block' }}
                  >
                    {file.name}
                  </Typography.Text>

                  {/* File actions */}
                  {file.isFolder ? null : (
                    <Menu className="file-card-actions">
                      {fileActions.map((action) => (
                        <Menu.Item
                          key={action.key}
                          onClick={(e) => {
                            // return console.log(e);
                            e.domEvent.stopPropagation();
                            action.onClick(file);
                          }}
                          style={{
                            backgroundColor: '#f4f4f4',
                            color: '#333333',
                            maxWidth: 'max-content',
                            maxHeight: 'max-content',
                            margin: '0',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s ease-in-out',
                          }}
                        >
                          <Tooltip placement="bottom" title={action.label}>
                            <span>{action.icon}</span>
                          </Tooltip>
                        </Menu.Item>
                      ))}
                    </Menu>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>

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
            onChange={onFolderNameChange}
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
              onClick={onAddFolder}
            >
              Create Folder
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <Tooltip title={selectedFile?.name}>
            <h2 className="mr-auto text-ellipsis overflow-hidden whitespace-nowrap max-w-[25ch]">
              {selectedFile?.name}
            </h2>
          </Tooltip>
        }
        open={isCarouselModalOpen}
        onCancel={closeCarouselModal}
        footer={
          <div className="flex justify-between items-center w-full text-sm text-gray-500 p-4">
            <div className="flex flex-col text-left">
              <span className="font-semibold text-gray-700">MIME Type</span>
              <span className="text-gray-500">{selectedFile?.mimeType}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Size</span>
              <span className="text-gray-500">
                {formatSize(selectedFile?.sizeInByte)}
              </span>
            </div>
          </div>
        }
        centered
        style={{
          width: '1024px',
          height: 'auto',
        }}
      >
        {selectedFile?.mimeType === 'application/pdf' ? (
          <object
            data={selectedFile?.cloudinarySecureUrl}
            type="application/pdf"
            width="100%"
            height="600px"
          >
            <p>
              Your browser does not support PDFs.{' '}
              <a href={selectedFile?.cloudinarySecureUrl}>Download the PDF</a>
            </p>
          </object>
        ) : (
          <Carousel
            dots={false}
            infinite={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {selectedFile && (
              <Image
                src={selectedFile?.cloudinarySecureUrl}
                alt={selectedFile?.name}
                width={960}
                height={960}
              />
            )}
          </Carousel>
        )}
      </Modal>
    </Layout>
  );
}
