import { createFile } from '@/services/files.http';
import { Button, Divider, Modal, Upload, Progress } from 'antd';
import { Inbox, UploadIcon } from 'lucide-react';
import React, { useState } from 'react';

export default function CustomUpload({
  currentPath,
  filesToUpload,
  setFilesToUpload,
  setUploadStatus,
  buttonText = 'Upload Files',
}) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // For loading state
  const [uploadProgress, setUploadProgress] = useState(0); // For upload progress

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setFilesToUpload([]);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setLoading(false); // Reset loading state when modal is closed
    setUploadProgress(0); // Reset progress when modal is closed
    setFilesToUpload([]);
  };

  const handleFileChange = ({ fileList: newFilesToUpload }) => {
    if (newFilesToUpload.length === 0) {
      return setFilesToUpload(newFilesToUpload);
    }

    if (filesToUpload.length > newFilesToUpload.length) {
      return setFilesToUpload(newFilesToUpload);
    }

    const lastItem = newFilesToUpload[newFilesToUpload.length - 1];
    const newFileData = {
      file: lastItem.originFileObj,
      batchId: 'c62ac9e3-b939-46d8-97c0-9d07b2befb81',
      name: lastItem.name,
      entity: 'files',
      category: 'myFiles',
      isFolder: 'false',
      mimeType: lastItem.type,
      sizeInByte: lastItem.size,
      path: JSON.stringify(currentPath),
    };

    setFilesToUpload([...filesToUpload, newFileData]);
  };

  const handleFileUpload = async () => {
    setLoading(true); // Set loading state
    setUploadStatus('uploading');
    const totalFiles = filesToUpload.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = filesToUpload[i];

      const formData = new FormData();
      for (const key in file) {
        formData.append(key, file[key]);
      }

      try {
        const res = await createFile(formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prevProgress) => {
              const newProgress = Math.max(prevProgress, percent);
              return newProgress;
            });
          },
        });

        if (res.status === 201) {
          console.log('Successfully uploaded!');
          setUploadStatus('success');
        } else {
          console.log('Upload failed!');
          setUploadStatus('failed');
        }
      } catch (error) {
        console.log('Error uploading file:', error);
        setUploadStatus('failed');
      }
    }

    setLoading(false);
    setUploadProgress(0); // Reset progress after upload
    closeUploadModal();
  };

  return (
    <>
      <Button
        size="large"
        type="primary"
        icon={<UploadIcon size={18} className="mt-1" />}
        onClick={openUploadModal}
      >
        {buttonText}
      </Button>
      <Modal
        title="Upload Files"
        open={isUploadModalOpen}
        onCancel={closeUploadModal}
        footer={[
          <>
            <Divider />
            <Button
              key="cancel"
              onClick={closeUploadModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={handleFileUpload}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              loading={loading} // Show loading spinner on upload button
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </>,
        ]}
        className="max-w-lg mx-auto"
      >
        <Upload
          fileList={filesToUpload}
          style={{ marginTop: '20px' }}
          accept=".pdf,.jpg,.jpeg,.png"
          beforeUpload={() => {
            return false;
          }}
          onChange={handleFileChange}
          className="w-full"
        >
          <div className="text-center border-2 border-dashed border-gray-300 p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300">
            <p className="ant-upload-drag-icon">
              <Inbox
                size={30}
                className="mx-auto text-gray-500"
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            </p>
            <p className="ant-upload-text text-xl text-gray-700 font-medium">
              Click or drag files to this area to upload
            </p>
            <p className="ant-upload-hint text-gray-500 mt-2">
              Support for a single or bulk upload.
            </p>
          </div>
        </Upload>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <Progress
              percent={uploadProgress}
              status="active"
              strokeColor="#4caf50"
              showInfo={false}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
