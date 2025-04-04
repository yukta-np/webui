import React from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';

const { Title, Text } = Typography;

const schedule = {
  Sunday: [
    {
      subject: 'Mathematics 101',
      time: '09:00 - 10:30',
      room: 'Room 301',
      teacher: 'Dr. Smith',
      color: '#e6f7ff',
    },
  ],
  Monday: [
    {
      subject: 'Mathematics 101',
      time: '09:00 - 10:30',
      room: 'Room 301',
      teacher: 'Dr. Smith',
      color: '#e6f7ff',
    },
    {
      subject: 'Physics',
      time: '11:00 - 12:30',
      room: 'Lab 202',
      teacher: 'Prof. Johnson',
      color: '#f0f5ff',
    },
  ],
  Tuesday: [
    {
      subject: 'Computer Science',
      time: '14:00 - 15:30',
      room: 'Computer Lab 101',
      teacher: 'Dr. Williams',
      color: '#f6ffed',
    },
  ],
  Wednesday: [
    {
      subject: 'Literature',
      time: '10:00 - 11:30',
      room: 'Room 105',
      teacher: 'Prof. Davis',
      color: '#fffbe6',
    },
  ],
  Thursday: [
    {
      subject: 'Chemistry',
      time: '13:00 - 14:30',
      room: 'Lab 303',
      teacher: 'Dr. Miller',
      color: '#fff1f0',
    },
  ],
  Friday: [],
};

const WeeklySchedule = () => {
  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Weekly Schedule</Title>
      <Button type="primary" style={{ float: 'right' }}>
        Add Class
      </Button>
      <Row gutter={16} style={{ marginTop: 20 }}>
        {Object.entries(schedule).map(([day, classes]) => (
          <Col key={day} span={4} style={{ textAlign: 'center' }}>
            <Card
              title={<b>{day}</b>}
              bordered={false}
              style={{ minHeight: 300 }}
            >
              {classes.length > 0 ? (
                classes.map((cls, index) => (
                  <Card
                    key={index}
                    style={{ marginBottom: 10, backgroundColor: cls.color }}
                    bordered={false}
                  >
                    <Title level={5}>{cls.subject}</Title>
                    <Text>{cls.time}</Text>
                    <br />
                    <Text strong>Room: {cls.room}</Text>
                    <br />
                    <Text type="secondary">{cls.teacher}</Text>
                  </Card>
                ))
              ) : (
                <Text type="secondary">No classes scheduled</Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WeeklySchedule;
