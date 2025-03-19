import { Avatar, Card, List, Tag, Progress, Divider } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

export default function StudentProfile() {
  const [assignments] = useState([
    { title: 'Calculus Homework', status: 'submitted', grade: 'A' },
    { title: 'Physics Lab Report', status: 'pending', due: '2024-03-25' },
  ]);

  const attendance = [
    { subject: 'Mathematics', present: 18, total: 20 },
    { subject: 'Physics', present: 15, total: 20 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card className="text-center shadow-sm">
            <Avatar
              size={128}
              icon={<UserOutlined />}
              src="https://i.pravatar.cc/150?img=5"
            />
            <h1 className="text-2xl font-bold mt-4">John Anderson</h1>
            <Tag color="blue" className="mt-2 text-lg">
              Computer Science
            </Tag>

            <Divider className="my-4" />

            <div className="text-left space-y-2">
              <p>
                <BookOutlined className="mr-2" />
                4th Semester
              </p>
              <p>
                <CalendarOutlined className="mr-2" />
                2024 Batch
              </p>
              <p>
                <MailOutlined className="mr-2" />
                john.a@university.edu
              </p>
              <p className="font-semibold">Student ID: CS-2024-001</p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          <Card title="Attendance Summary" className="shadow-sm">
            {attendance.map((subject, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{subject.subject}</span>
                  <span>
                    {((subject.present / subject.total) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  percent={((subject.present / subject.total) * 100).toFixed(0)}
                  status={
                    subject.present / subject.total > 0.75
                      ? 'success'
                      : 'exception'
                  }
                />
              </div>
            ))}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Assignments" className="shadow-sm">
              <List
                dataSource={assignments}
                renderItem={(item) => (
                  <List.Item>
                    <div className="flex justify-between w-full items-center">
                      <span>{item.title}</span>
                      {item.status === 'submitted' ? (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          Graded: {item.grade}
                        </Tag>
                      ) : (
                        <Tag color="warning" icon={<CalendarOutlined />}>
                          Due: {item.due}
                        </Tag>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <Card title="Academic Overview" className="shadow-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Current GPA</h4>
                  <Progress
                    type="circle"
                    percent={85}
                    width={80}
                    format={() => '3.7'}
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Enrolled Courses</h4>
                  <Tag color="blue">Calculus</Tag>
                  <Tag color="blue">Physics</Tag>
                  <Tag color="blue">Programming</Tag>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
