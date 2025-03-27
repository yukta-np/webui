import {
  Avatar,
  Card,
  Tag,
  Timeline,
  List,
  Checkbox,
  Progress,
  Divider,
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

export default function TeacherProfile() {
  const [availability, setAvailability] = useState(true);
  const [tasks, setTasks] = useState([
    { title: 'Grade Calculus Papers', completed: false },
    { title: 'Prepare Lesson Plan', completed: true },
  ]);

  const schedule = [
    { time: 'Mon 9:00 AM', subject: 'Mathematics', room: 'B-204' },
    { time: 'Tue 2:00 PM', subject: 'Physics', room: 'Lab-3' },
  ];

  const attendanceData = [
    { subject: 'Mathematics', present: 45, total: 50 },
    { subject: 'Physics', present: 48, total: 50 },
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
              src="https://i.pravatar.cc/150?img=3"
            />
            <h1 className="text-2xl font-bold mt-4">Dr. Sarah Johnson</h1>
            <Tag color="blue" className="mt-2 text-lg">
              Senior Professor
            </Tag>
            <Tag
              color={availability ? 'green' : 'red'}
              className="mt-2 cursor-pointer text-lg"
              onClick={() => setAvailability(!availability)}
            >
              {availability ? 'Available' : 'In Class'}
            </Tag>

            <Divider className="my-4" />

            <div className="text-left space-y-2">
              <p>
                <MailOutlined className="mr-2" />
                sarah.j@university.edu
              </p>
              <p>
                <PhoneOutlined className="mr-2" />
                +1 (555) 123-4567
              </p>
              <p className="font-semibold">Department: Computer Science</p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          <Card title="Teaching Schedule" className="shadow-sm">
            <Timeline
              mode="left"
              items={schedule.map((item, index) => ({
                key: index,
                label: <span className="font-medium">{item.time}</span>,
                children: (
                  <div>
                    <p className="m-0 font-semibold">{item.subject}</p>
                    <p className="m-0 text-gray-600">{item.room}</p>
                  </div>
                ),
                dot: <ClockCircleOutlined className="text-xl" />,
              }))}
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Attendance Management" className="shadow-sm">
              {attendanceData.map((subject, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>{subject.subject}</span>
                    <span>
                      {((subject.present / subject.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    percent={((subject.present / subject.total) * 100).toFixed(
                      0
                    )}
                  />
                </div>
              ))}
            </Card>

            <Card title="Tasks & To-Do List" className="shadow-sm">
              <List
                dataSource={tasks}
                renderItem={(item, index) => (
                  <List.Item>
                    <Checkbox
                      checked={item.completed}
                      onChange={(e) => {
                        const newTasks = [...tasks];
                        newTasks[index].completed = e.target.checked;
                        setTasks(newTasks);
                      }}
                    >
                      <span
                        className={
                          item.completed ? 'line-through text-gray-400' : ''
                        }
                      >
                        {item.title}
                      </span>
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
