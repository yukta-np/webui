import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Layout,
  Card,
  Col,
  Divider,
  Row,
  Select,
  Spin,
  Modal,
} from 'antd';
import { useRoutines } from '@/hooks/useRoutines';
import { useUsers } from '@/hooks/useUsers'; // Assuming you have or will create this hook

import './styles.css';
import { WeekDay, Actions } from '@/constants';
import { createRoutines, updateRoutines } from '@/services/routine.http';

const { Content } = Layout;
const { useBreakpoint } = Grid;

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

  // Data hooks
  const {
    routines,
    isLoading: isRoutinesLoading,
    error: routinesError,
  } = useRoutines();
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers();
  const screens = useBreakpoint();

  const getTitle = () => {
    if (action === 'add') {
      return 'Add New Details';
    } else if (action === 'edit') {
      return 'Edit details';
    }
    return '';
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);
    console.log(values);
    try {
      setIsProcessing(true);
      const res =
        action === Actions.add
          ? await createRoutines(values)
          : await updateRoutines(currentInquiryId, values);
      openNotification(`Inquiry ${action}ed successfully`);
      setIsModalVisible(false);
      revalidate();
      form.resetFields();
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler functions
  const onAddClick = () => {
    setAction('add');
    openModal();
  };

  const onProgramLevelChange = (value) => {
    setCurrentProgramLevel(value);
  };

  // Effects
  useEffect(() => {
    if (routines?.length > 0) {
      const levels = Array.from(new Set(routines.map((r) => r.programLevel)));
      setProgramLevels(levels);
      if (!currentProgramLevel && levels.length > 0) {
        setCurrentProgramLevel(levels[0]);
      }
    }
  }, [routines]);

  // Utility functions
  const formatTime = (timeString) =>
    timeString.split(':').slice(0, 2).join(':');

  const filterAndSortRoutines = (routines, weekDay, currentProgramLevel) => {
    return (
      routines
        ?.filter(
          (r) => r.weekDay === weekDay && r.programLevel === currentProgramLevel
        )
        ?.sort((a, b) => {
          const [aHours, aMins] = a.startTime.split(':').map(Number);
          const [bHours, bMins] = b.startTime.split(':').map(Number);
          return aHours * 60 + aMins - (bHours * 60 + bMins);
        })
        .map((routine) => ({
          ...routine,
          title: routine.subject,
          description: `${formatTime(routine.startTime)} to ${formatTime(
            routine.endTime
          )}`,
          instructorName:
            users?.find((users) => users.id === routine.userId)?.fullName ||
            routine.userId,
        })) || []
    );
  };

  // Components
  const DayHeader = ({ day }) => <div className="font-bold text-lg">{day}</div>;

  const NoRoutinesMessage = () => (
    <div className="text-gray-500">No routines scheduled</div>
  );

  const RoutineCard = ({ routine }) => (
    <Card size="small" className="w-[200px]" title={routine.title}>
      <p>Time: {routine.description}</p>
      {routine.room && <p>Room: {routine.room}</p>}
      {routine.instructorName && <p>Instructor: {routine.instructorName}</p>}
    </Card>
  );

  const RoutineCards = ({ routines }) => {
    if (!routines?.length) return <NoRoutinesMessage />;
    return (
      <div className="flex flex-wrap gap-3">
        {routines.map((routine) => (
          <RoutineCard
            key={`${routine.weekDay}-${routine.startTime}-${routine.userId}`}
            routine={routine}
          />
        ))}
      </div>
    );
  };

  const DayColumn = ({ day, routines }) => (
    <div className="flex flex-col gap-2">
      <DayHeader day={day} />
      <RoutineCards routines={routines} />
    </div>
  );

  const TimetableMainView = ({ routines, currentProgramLevel, WeekDay }) => (
    <div className="flex flex-col gap-4 border-2 border-solid border-blue-500 h-[500px] border-l ml-6 p-4 overflow-y-auto">
      {Object.keys(WeekDay).map((day) => {
        const dayRoutines = filterAndSortRoutines(
          routines,
          day,
          currentProgramLevel
        );
        return <DayColumn key={day} day={day} routines={dayRoutines} />;
      })}
    </div>
  );

  // Error and loading states
  if (routinesError || usersError) {
    return <div>Error loading data</div>;
  }

  if (isRoutinesLoading || isUsersLoading) {
    return <Spin size="large" />;
  }

  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <div
        style={{
          minHeight: 360,
          background: 'white',
          borderRadius: 8,
          margin: 0,
          padding: 0,
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
            <p className="text-xl font-bold">Routine</p>
            <Select
              onChange={onProgramLevelChange}
              className="w-36"
              value={currentProgramLevel}
              loading={isRoutinesLoading}
            >
              {programLevels.map((level, index) => (
                <Select.Option key={index} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Button type="primary" onClick={onAddClick}>
            Add New
          </Button>
        </div>

        <Divider orientation="left">Routine</Divider>
        <Row gutter={16}>
          <Col span={19} className="flex-col gap-2">
            <TimetableMainView
              routines={routines}
              currentProgramLevel={currentProgramLevel}
              WeekDay={WeekDay}
            />
            <div className="border-2 border-solid border-green-500 h-40 border-l ml-6 mt-6"></div>
          </Col>
          <Col span={5}>
            <div className="border-2 border-solid border-red-500 h-[700px] border-l mr-6 overflow-y-auto"></div>
          </Col>
        </Row>
        <Modal
          title={getTitle()}
          open={isModalVisible}
          onCancel={closeModal}
          onOk={() => form.submit()}
          confirmLoading={isProcessing}
          footer={
            action === 'add' ? (
              <>
                <Divider />
                <Button className="mr-2" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Apply
                </Button>
              </>
            ) : action === 'edit' ? (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Update
                </Button>
              </>
            ) : (
              <>
                <Divider />
                <Button onClick={closeModal}>Cancel</Button>
              </>
            )
          }
        ></Modal>
      </div>
    </Content>
  );
};

export default Routine;
