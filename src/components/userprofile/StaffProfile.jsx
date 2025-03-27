import { Avatar, Card, List, Tag, Progress, Divider } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

export default function StaffProfile() {
  const [tasks] = useState([
    { title: 'Process Admissions', status: 'in-progress', progress: 65 },
    { title: 'Organize Faculty Event', status: 'pending', progress: 20 },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card className="text-center shadow-sm">
            <Avatar
              size={128}
              icon={<UserOutlined />}
              src="https://i.pravatar.cc/150?img=7"
            />
            <h1 className="text-2xl font-bold mt-4">Michael Brown</h1>
            <Tag color="purple" className="mt-2 text-lg">
              Administration
            </Tag>

            <Divider className="my-4" />

            <div className="text-left space-y-2">
              <p>
                <DashboardOutlined className="mr-2" />
                Admissions Officer
              </p>
              <p>
                <MailOutlined className="mr-2" />
                michael.b@university.edu
              </p>
              <p>
                <PhoneOutlined className="mr-2" />
                +1 (555) 987-6543
              </p>
              <p className="font-semibold">Office: Admin Block A-102</p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          <Card title="Current Tasks" className="shadow-sm">
            <List
              dataSource={tasks}
              renderItem={(item) => (
                <List.Item>
                  <div className="w-full">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.title}</span>
                      <Tag
                        color={item.status === 'in-progress' ? 'blue' : 'gray'}
                      >
                        {item.status.toUpperCase()}
                      </Tag>
                    </div>
                    <Progress
                      percent={item.progress}
                      status={
                        item.status === 'completed' ? 'success' : 'active'
                      }
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Work Schedule" className="shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <Tag color="blue">9:00 AM - 5:00 PM</Tag>
                </div>
                <div className="flex justify-between">
                  <span>Lunch Break</span>
                  <Tag color="orange">1:00 PM - 2:00 PM</Tag>
                </div>
              </div>
            </Card>

            <Card title="Department Overview" className="shadow-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Pending Applications</h4>
                  <Progress percent={35} status="active" />
                </div>
                <div>
                  <h4 className="font-medium">Processed Documents</h4>
                  <Progress percent={78} status="success" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
