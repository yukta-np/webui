import React, { useState } from 'react';
import { Button, Flex, Modal } from 'antd';

const AddTask = () => {
    const [open, setOpen] = useState(false);
    const [openResponsive, setOpenResponsive] = useState(false);
  return (
   <Flex vertical gap="middle" align="flex-start">
   
      {/* Responsive */}
      <Button type="primary" onClick={() => setOpenResponsive(true)}>
        Add Task
      </Button>
      <Modal
        title="Modal responsive width"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </Flex>
  );
  
}

export default AddTask