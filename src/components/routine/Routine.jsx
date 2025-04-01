import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Spin,
  Typography,
  TimePicker,
} from 'antd';
import { useRoutines } from '@/hooks/useRoutines';
import { createRoutines, updateRoutines } from '@/services/routine.http';
import { WeekDay, Actions } from '@/constants';
import './styles.css';

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Routine = () => {
  // State management
  const [weekDay, setWeekDay] = useState(
    Object.keys(WeekDay)[new Date().getDay()]
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState(Actions.add);
  const [programLevels, setProgramLevels] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgramLevel, setCurrentProgramLevel] = useState(null);
  const [form] = Form.useForm();

  // Data hooks
  const {
    routines,
    isLoading: isRoutinesLoading,
    error: routinesError,
  } = useRoutines();
  const screens = useBreakpoint();

  // Handler functions
  const onAddClick = () => {
    setAction('add');
    setIsModalVisible(true);
  };

  const onProgramLevelChange = (value) => {
    setCurrentProgramLevel(value);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onSubmit = async () => {
    try {
      setIsProcessing(true);
      const values = await form.validateFields();

      // Format time values
      const formattedValues = {
        ...values,
        startTime: values.timeRange[0].format('HH:mm:ss'),
        endTime: values.timeRange[1].format('HH:mm:ss'),
        timeRange: undefined, // Remove the timeRange field
      };

      // Call API to create routine
      await createRoutines(formattedValues);

      // Refresh the routines data
      await mutate();

      message.success('Class added successfully');
      closeModal();
    } catch (error) {
      console.error('Error adding class:', error);
      message.error('Failed to add class');
    } finally {
      setIsProcessing(false);
    }
  };

  // Effects
  useEffect(() => {
    if (!routines || routines.length === 0) {
      setProgramLevels([]); // Explicitly set to empty array if no routines
      return;
    }

    const levels = Array.from(
      new Set(routines.map((r) => r.group.programLevel))
    );
    setProgramLevels(levels);

    if (!currentProgramLevel && levels.length > 0) {
      setCurrentProgramLevel(levels[0]);
    }
  }, [routines]);

  console.log('programLevels', programLevels);

  // Utility functions
  const formatTime = (timeString) =>
    timeString.split(':').slice(0, 2).join(':');

  const filterAndSortRoutines = (routines, weekDay, currentProgramLevel) => {
    return (
      routines
        ?.filter(
          (r) =>
            r.weekDay === weekDay &&
            r.group.programLevel === currentProgramLevel
        )
        ?.sort((a, b) => {
          const [aHours, aMins] = a.startTime.split(':').map(Number);
          const [bHours, bMins] = b.startTime.split(':').map(Number);
          return aHours * 60 + aMins - (bHours * 60 + bMins);
        })
        .map((routine) => ({
          ...routine,
          subject: routine.subject,
          time: `${formatTime(routine.startTime)} - ${formatTime(
            routine.endTime
          )}`,
          room: routine.room,
          teacher: routine.user?.fullName,
          room: `${routine.area?.room} - ${routine.area?.room_no}`,
          color: '#f0f5ff', // You can customize colors based on subject or other criteria
        })) || []
    );
  };

  // Error and loading states
  if (routinesError) {
    return <div>Error loading data</div>;
  }

  if (isRoutinesLoading) {
    return <Spin size="large" />;
  }

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <div
        style={{
          minHeight: 360,
          background: 'white',
          borderRadius: 8,
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: screens.xs ? 'column' : 'row',
            gap: 16,
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div className="flex items-center gap-4">
            <Title level={2} style={{ margin: 0 }}>
              Weekly Schedule
            </Title>
          </div>
          <Button type="primary" onClick={onAddClick}>
            Add Class
          </Button>
        </div>
        <Select
          onChange={onProgramLevelChange}
          className="w-36"
          value={currentProgramLevel}
          loading={isRoutinesLoading}
          options={programLevels.map((level, index) => ({
            label: level,
            value: level,
            key: index,
          }))}
        />
        <Divider orientation="left">Schedule</Divider>

        <Row gutter={16} style={{ marginTop: 20 }}>
          {Object.keys(WeekDay).map((day) => {
            const dayRoutines = filterAndSortRoutines(
              routines,
              day,
              currentProgramLevel
            );

            return (
              <>
                <Col
                  key={day}
                  xs={12}
                  sm={8}
                  md={6}
                  lg={4}
                  xl={3}
                  style={{ textAlign: 'center' }}
                >
                  <Card
                    title={<b>{day}</b>}
                    bordered={false}
                    style={{ minHeight: 300 }}
                  >
                    {dayRoutines.length > 0 ? (
                      dayRoutines.map((routine, index) => (
                        <Card
                          key={index}
                          style={{
                            marginBottom: 10,
                            backgroundColor: routine.color,
                          }}
                          bordered={false}
                        >
                          <Title level={5}>{routine.subject}</Title>
                          <Text>{routine.time}</Text>
                          <br />
                          {routine.room && (
                            <>
                              <Text>Room: {routine.room}</Text>
                              <br />
                            </>
                          )}
                          {routine.teacher && (
                            <Text type="secondary">{routine.teacher}</Text>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Text type="secondary">No classes scheduled</Text>
                    )}
                  </Card>
                </Col>
              </>
            );
          })}
        </Row>

        <Modal
          title={action === 'add' ? 'Add New Class' : 'Edit Class'}
          open={isModalVisible}
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={isProcessing}
              onClick={onSubmit}
            >
              {action === 'add' ? 'Add' : 'Update'}
            </Button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              weekDay: Object.keys(WeekDay)[0],
              programLevel: currentProgramLevel,
            }}
          >
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please enter subject name' }]}
            >
              <Input placeholder="Enter subject name" />
            </Form.Item>

            <Form.Item
              name="weekDay"
              label="Day of Week"
              rules={[{ required: true, message: 'Please select a day' }]}
              options={Object.keys(WeekDay).map((day) => ({
                label: day,
                value: day,
              }))}
            >
              <Select />
            </Form.Item>

            <Form.Item
              name="timeRange"
              label="Time"
              rules={[{ required: true, message: 'Please select time range' }]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                minuteStep={15}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="programLevel"
              label="Program Level"
              rules={[
                { required: true, message: 'Please select program level' },
              ]}
            >
              <Select
                options={programLevels.map((level) => ({
                  label: level,
                  value: level,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="room"
              label="Room"
              rules={[{ required: true, message: 'Please enter room details' }]}
            >
              <Input placeholder="Enter room number/building" />
            </Form.Item>

            <Form.Item
              name="teacher"
              label="Teacher"
              rules={[{ required: true, message: 'Please enter teacher name' }]}
            >
              <Input placeholder="Enter teacher's name" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Content>
  );
};

export default Routine;
