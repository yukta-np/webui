import { createDocument } from '@/services/documents.http';
import { Button, Divider, Modal, Upload } from 'antd';
import { Inbox, UploadIcon } from 'lucide-react';
import React, { useState } from 'react';

export default function CustomUpload() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setFileList([]);
    setIsUploadModalOpen(false);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    console.log('File change called!!');

    if (newFileList.length === 0) {
      return setFileList(newFileList);
    }

    // !important for handling file removal and state update.
    if (fileList.length > newFileList.length) {
      return setFileList(newFileList);
    }

    const lastItem = newFileList[newFileList.length - 1];
    const newFileData = {
      file: lastItem.originFileObj,
      batchId: 'c62ac9e3-b939-46d8-97c0-9d07b2befb81',
      name: lastItem.name,
      fileName: lastItem.name, // TODO: remove this in the backend as well...just accept 'name' in DTO
      entity: 'attachments',
      category: 'myFiles',
      sizeInByte: lastItem.size,
      organisationId: 1,
      createdBy: 2,
    };

    setFileList([...fileList, newFileData]);
  };

  const handleFileUpload = async () => {
    const file = fileList[0]; // TODO: loop through entire array for multifile upload

    const formData = new FormData();

    for (const key in file) {
      formData.append(key, file[key]);
    }

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Make the API request using fetch or axios
    try {
      const res = await createDocument(formData);
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
        Upload
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
          fileList={fileList}
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
