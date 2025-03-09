import { useState } from 'react';
import {
  Layout,
  Tabs,
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Card,
  Tag,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const ClassroomManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [classStructure, setClassStructure] = useState([[2], [3], [3], [3]]);
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Single Desk',
      type: 'Furniture',
      documentBatchId: 'FURN-001',
    },
    {
      id: 2,
      name: 'Whiteboard',
      type: 'Equipment',
      documentBatchId: 'EQP-002',
    },
  ]);

  const inventoryColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Document Batch ID', dataIndex: 'documentBatchId' },
    {
      title: 'Action',
      render: () => <Button danger icon={<DeleteOutlined />} />,
    },
  ];

  const handleAddInventory = () => {
    // Add inventory logic here
  };

  const calculateCapacity = () => {
    return classStructure.flat().reduce((acc, val) => acc + val, 0);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow">
        <h1 className="text-xl font-bold">Classroom Management System</h1>
      </Header>

      <Content className="p-6">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Inventory" key="1">
            <Card className="mb-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Assets Inventory</h2>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddInventory}
                >
                  Add Item
                </Button>
              </div>
              <Table
                columns={inventoryColumns}
                dataSource={inventory}
                rowKey="id"
              />
            </Card>
          </TabPane>

          <TabPane tab="Classroom Management" key="2">
            <Card className="mb-4">
              <Form form={form} layout="vertical">
                <div className="grid grid-cols-3 gap-4">
                  <Form.Item label="Class Name" name="className">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Class Number" name="classNumber">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Capacity" name="capacity">
                    <InputNumber
                      disabled
                      value={calculateCapacity()}
                      className="w-full"
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <Form.Item label="Single Seats" name="singleSeats">
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                  <Form.Item label="Dual Seats" name="dualSeats">
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                  <Form.Item label="Triple Seats" name="tripleSeats">
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                  <Form.Item label="Whiteboards" name="whiteboards">
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                </div>

                <Button type="primary">Create Classroom</Button>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab="Seat Allocation" key="3">
            <Card>
              <div className="mb-4">
                <Tag color="blue" className="text-lg">
                  Total Capacity: {calculateCapacity()}
                </Tag>
              </div>

              <div className="flex gap-8 overflow-x-auto p-4 bg-gray-50 rounded-lg">
                {classStructure.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-4">
                    {column.map((desk, deskIndex) => (
                      <div
                        key={deskIndex}
                        className="relative w-20 h-20 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-gray-600">{desk}</span>
                        <Button
                          danger
                          shape="circle"
                          size="small"
                          icon={<DeleteOutlined />}
                          className="absolute -top-2 -right-2"
                          onClick={() => {
                            const newStructure = [...classStructure];
                            newStructure[colIndex].splice(deskIndex, 1);
                            setClassStructure(newStructure);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        const newStructure = [...classStructure];
                        newStructure[colIndex].push(1);
                        setClassStructure(newStructure);
                      }}
                    >
                      Add Desk
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setClassStructure([...classStructure, []])}
                >
                  Add Column
                </Button>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default ClassroomManagement;
