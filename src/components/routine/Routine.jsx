import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Layout,
  Table,
  Card,
  List,
  Col,
  Divider,
  Row,
  Select,
} from 'antd';
import { useRoutine } from '@/hooks/useRoutine';
import './styles.css';
import { WeekDay } from '@/constants';

const DemoBox = (props) => (
  <p className={`height-${props.value}`}>{props.children}</p>
);
const { Content } = Layout;
const { useBreakpoint } = Grid;

const Routine = () => {
  const [weekDay, setWeekDay] = useState(
    Object.keys(WeekDay)[new Date().getDay()]
  );

  const { routines, isLoading, error } = useRoutine();
  const [programLevels, setProgramLevels] = useState([]);
  const [currentProgramLevel, setCurrentProgramLevel] = useState(null);
  const screens = useBreakpoint();
  const onAddClick = () => {
    // Your add new routine logic here
    console.log('Add new routine clicked');
  };

  useEffect(() => {
    console.log('routines', routines);
    console.log('programLevels', programLevels);
    if (routines && routines.length > 0) {
      const programLevels = Array.from(
        new Set(routines.map((routine) => routine.programLevel))
      );
      console.log(programLevels);
      setProgramLevels(programLevels);
    }
  }, [routines]);

  useEffect(() => {
    console.log('programLevels', programLevels);
  }, [programLevels]);

  const onWeekDayDecrease = (e) => {
    const weekDayKeys = Object.keys(WeekDay);
    const currentIndex = weekDayKeys.indexOf(weekDay);
    const newIndex =
      (currentIndex - 1 + weekDayKeys.length) % weekDayKeys.length;
    setWeekDay(weekDayKeys[newIndex]);
  };

  const onWeekDayIncrease = (e) => {
    const weekDayKeys = Object.keys(WeekDay);
    const currentIndex = weekDayKeys.indexOf(weekDay);
    const newIndex = (currentIndex + 1) % weekDayKeys.length;
    setWeekDay(weekDayKeys[newIndex]);
  };

  const onProgramLevelChange = (value) => {
    setCurrentProgramLevel(value);
    console.log('value', value);
  };
  const formatTime = (timeString) =>
    timeString.split(':').slice(0, 2).join(':');
  const data =
    routines
      ?.filter(
        (r) => r.weekDay === weekDay && r.programLevel === currentProgramLevel
      )
      .map((routine) => {
        // Format time without seconds (HH:MM format)

        return {
          ...routine, // Include all original routine data
          title: `${routine.subject}`,
          weekDay: `${routine.weekDay}- `,
          description: `${formatTime(routine.startTime)} to ${formatTime(
            routine.endTime
          )}`,
        };
      }) || [];

  if (error) return <div>Error loading routines</div>;

  const filterAndSortRoutines = (routines, weekDay, currentProgramLevel) => {
    return (
      routines
        ?.filter(
          (r) => r.weekDay === weekDay && r.programLevel === currentProgramLevel
        )
        ?.sort((a, b) => {
          // Convert "HH:MM" to minutes for accurate comparison
          const [aHours, aMins] = a.startTime.split(':').map(Number);
          const [bHours, bMins] = b.startTime.split(':').map(Number);
          return aHours * 60 + aMins - (bHours * 60 + bMins);
        })
        .map((routine) => ({
          ...routine,
          title: `${routine.subject}`,
          teacher: `${routine.userId}`,
          description: `${formatTime(routine.startTime)} to ${formatTime(
            routine.endTime
          )}`,
        })) || []
    );
  };

  if (error) return <div>Error loading routines</div>;

  // TimetableMainView.jsx
  const TimetableMainView = ({ routines, currentProgramLevel, WeekDay }) => {
    return (
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
  };

  // DayColumn.jsx
  const DayColumn = ({ day, routines }) => {
    return (
      <div className="flex flex-col gap-2">
        <DayHeader day={day} />
        <RoutineCards routines={routines} />
      </div>
    );
  };

  // DayHeader.jsx
  const DayHeader = ({ day }) => {
    return <div className="font-bold text-lg">{day}</div>;
  };

  // RoutineCards.jsx
  const RoutineCards = ({ routines }) => {
    if (!routines?.length) {
      return <NoRoutinesMessage />;
    }

    return (
      <div className="flex flex-wrap gap-3">
        {routines.map((routine) => (
          <RoutineCard
            key={`${routine.weekDay}-${routine.startTime}`}
            routine={routine}
          />
        ))}
      </div>
    );
  };

  // RoutineCard.jsx
  const RoutineCard = ({ routine }) => {
    return (
      <Card size="small" className="w-[200px]" title={routine.title}>
        <p>Time: {routine.description}</p>
        {routine.room && <p>Room: {routine.room} </p>}
        {routine.userId && <p>Instructor: {routine.userId}</p>}
      </Card>
    );
  };

  // NoRoutinesMessage.jsx
  const NoRoutinesMessage = () => {
    return <div className="text-gray-500">No routines scheduled</div>;
  };
  return (
    <Content style={{ margin: screens.xs ? '0 8px' : '0 16px' }}>
      <div
        style={{
          // padding: screens.xs ? 16 : 24,
          minHeight: 360,
          background: 'white',
          borderRadius: 8,
          margin: '0px 0px 0px 0px',
          padding: '0px 0px 0px 0px',
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
          <p className="text-xl font-bold">
            Routine{' '}
            <Select onChange={onProgramLevelChange} className="w-36">
              {programLevels.map((level, index) => (
                <Select.Option key={index} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </p>

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
            <div className="border-2 border-solid border-red-500 h-[700px] border-l mr-6 overflow-y-auto">
              {' '}
              <div className="flex items-center justify-around border-2 border-solid border-blue-500 h-[30px] ">
                <div className="" onClick={onWeekDayDecrease}>
                  left
                </div>
                {weekDay}
                <div className="" onClick={onWeekDayIncrease}>
                  right
                </div>
              </div>
              <div className="list-box">
                {' '}
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 1,
                    column: 1,
                  }}
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      <Card title={item.title}>{item.description}</Card>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default Routine;
