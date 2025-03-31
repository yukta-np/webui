import { createFile } from '@/services/files.http';
import { Button, Divider, Modal, Upload } from 'antd';
import { Inbox, UploadIcon } from 'lucide-react';
import React, { useState } from 'react';

export default function CustomUpload({
  currentPath,
  filesToUpload,
  setFilesToUpload,
  buttonText = 'Upload Files',
}) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setFilesToUpload([]);
    setIsUploadModalOpen(false);
  };

  const handleFileChange = ({ fileList: newFilesToUpload }) => {
    console.log('File change called!!');

    if (newFilesToUpload.length === 0) {
      return setFilesToUpload(newFilesToUpload);
    }

    // !important for handling file removal and state update.
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
      sizeInByte: lastItem.size,
      path: JSON.stringify(currentPath),
    };

    setFilesToUpload([...filesToUpload, newFileData]);
  };

  const handleFileUpload = async () => {
    const file = filesToUpload[0]; // TODO: loop through entire array for multifile upload

    const formData = new FormData();

    for (const key in file) {
      formData.append(key, file[key]);
    }

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Make the API request using fetch or axios
    try {
      const res = await createFile(formData);
      console.log(res);

      if (res.status === 201) {
        console.log('Successfully uploaded!');

        closeUploadModal();
      } else {
        console.log('OOpsy doopsy, not uploaded');

        closeUploadModal();
      }
    } catch (error) {
      console.log(error);

      closeUploadModal();
    }
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
            <Button key="cancel" onClick={closeUploadModal}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={handleFileUpload}>
              Upload
            </Button>
          </>,
        ]}
      >
        <Upload
          fileList={filesToUpload}
          style={{ marginTop: '20px' }}
          accept=".pdf,.jpg,.jpeg,.png"
          beforeUpload={() => {
            return false;
          }}
          onChange={handleFileChange}
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
        </Upload>
      </Modal>
    </>
  );
}
