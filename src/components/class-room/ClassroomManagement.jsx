import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Layout,
  Grid,
  Select,
  Space,
  Avatar,
  Skeleton,
} from 'antd';
import { useAreas } from '@/hooks/useAreas';
import { useSeatAllocations } from '@/hooks/useSeatAllocations';
import { UserOutlined } from '@ant-design/icons';
import { assignGuardian } from '@/services/settings.http';

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Bench = ({
  capacity,
  columnIndex,
  benchIndex,
  seatAllocations,
  currentClassroom,
}) => {
  const getSeatOccupant = (seatPositionIndex) => {
    if (!seatAllocations || !currentClassroom?.id) return null;

    return seatAllocations.find(
      (allocation) =>
        allocation.areaId === currentClassroom.id &&
        allocation.benchRowIndex === benchIndex && // No +1 needed (0-based)
        allocation.benchColumnIndex === columnIndex && // No +1 needed (0-based)
        allocation.seatPosition === seatPositionIndex + 1 // Keep +1 (seatPosition is 1-based)
    );
  };
  console.log('Current bench check:', {
    classroomId: currentClassroom.id,
    componentIndices: {
      column: columnIndex,
      bench: benchIndex,
    },
    matchingAllocations: seatAllocations.filter(
      (a) =>
        a.areaId === currentClassroom.id &&
        a.benchRowIndex === columnIndex &&
        a.benchColumnIndex === benchIndex
    ),
    seatCapacity: capacity,
  });
  const renderSeats = () => {
    return Array.from({ length: capacity }).map((_, seatPositionIndex) => {
      const occupant = getSeatOccupant(seatPositionIndex);
      const isOccupied = !!occupant;

      return (
        <div
          key={`seat-${columnIndex}-${benchIndex}-${seatPositionIndex}`}
          style={{
            position: 'relative',
            width: 40,
            height: 48,
            backgroundColor: isOccupied ? '#f0f5ff' : '#fafafa',
            border: '1px solid #f0f0f0',
            borderLeft: seatPositionIndex === 0 ? '1px solid #f0f0f0' : 'none',
            borderRight: '1px solid #f0f0f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            type="secondary"
            style={{
              fontSize: 10,
              position: 'absolute',
              top: 2,
              left: 2,
              color: '#bfbfbf',
            }}
          >
            {seatPositionIndex + 1}
          </Text>

          {isOccupied ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar
                size={24}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff', marginBottom: 2 }}
              />
              <Text
                strong
                style={{ fontSize: 10, lineHeight: '12px', color: '#1890ff' }}
              >
                {occupant.studentId}
              </Text>
            </div>
          ) : (
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 2,
                backgroundColor: '#f0f0f0',
              }}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ position: 'relative', marginBottom: 32, paddingBottom: 12 }}>
      {/* Bench Backrest */}
      <div
        style={{
          height: 24,
          backgroundColor: '#f0f0f0',
          border: '1px solid #d9d9d9',
          borderBottom: 'none',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          marginBottom: -1,
        }}
      >
        <Text
          strong
          style={{
            fontSize: 12,
            paddingLeft: 8,
            lineHeight: '24px',
            color: '#595959',
          }}
        >
          Bench {benchIndex + 1}
        </Text>
      </div>

      {/* Seating Area */}
      <div
        style={{
          display: 'flex',
          position: 'relative',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: 4,
        }}
      >
        {capacity > 0 ? (
          <div style={{ display: 'flex' }}>{renderSeats()}</div>
        ) : (
          <div
            style={{
              width: 120,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <Text type="secondary" italic style={{ fontSize: 12 }}>
              No seats
            </Text>
          </div>
        )}
      </div>

      {/* Bench Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          padding: '0 8px',
        }}
      >
        <Text type="secondary" style={{ fontSize: 10 }}>
          Column {columnIndex + 1}
        </Text>
        <Text type="secondary" style={{ fontSize: 10 }}>
          {capacity} seat{capacity !== 1 ? 's' : ''}
        </Text>
      </div>
    </div>
  );
};

const ClassroomManagement = () => {
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const { areas, isLoading: isAreasLoading } = useAreas();
  const { seatAllocations, isLoading: isSeatLoading } = useSeatAllocations();

  const screens = useBreakpoint();

  const classroomAreas =
    areas?.filter((area) => area.category === 'classroom') || [];
  console.log('classes', classroomAreas);
  const classrooms = Array.from(new Set(classroomAreas.map((a) => a.name)));
  const structure =
    classroomAreas.find((a) => a.name === currentClassroom)?.structure || [];
  const currentClassroomData = classroomAreas.find(
    (a) => a.name === currentClassroom
  );

  console.log('struct', structure);

  useEffect(() => {
    if (classrooms.length > 0 && !currentClassroom) {
      setCurrentClassroom(classrooms[0]);
    }
  }, [classrooms]);

  useEffect(() => {
    console.log(seatAllocations);

    if (seatAllocations && seatAllocations.length > 0) {
      console.log(seatAllocations[0]);
    }
  }, [seatAllocations || []]);

  return (
    <Content
      style={{
        margin: screens.xs ? 16 : 24,
        padding: screens.xs ? 16 : 24,
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: screens.xs ? 'column' : 'row',
          gap: 16,
          justifyContent: 'space-between',
          marginBottom: 24,
          paddingBottom: 24,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Classroom Layout
        </Title>
        <Space>
          <Select
            onChange={setCurrentClassroom}
            value={currentClassroom}
            loading={isAreasLoading}
            style={{ width: 200 }}
            options={classrooms.map((name, index) => ({
              label: name,
              value: name,
              key: index,
            }))}
          />
          <Button type="primary">Add Classroom</Button>
        </Space>
      </div>
      {isAreasLoading || isSeatLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Row gutter={[32, 32]} justify="center" style={{ padding: 16 }}>
          {structure.map((column, columnIndex) => (
            <Col key={`column-${columnIndex}`}>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                {column.map((capacity, benchIndex) => (
                  <Bench
                    key={`bench-${columnIndex}-${benchIndex}`}
                    capacity={capacity}
                    columnIndex={columnIndex}
                    benchIndex={benchIndex}
                    seatAllocations={seatAllocations}
                    currentClassroom={currentClassroomData}
                  />
                ))}
              </div>
            </Col>
          ))}
          {structure.length === 0 && (
            <Col span={24}>
              <div
                style={{
                  textAlign: 'center',
                  padding: 48,
                  background: '#fafafa',
                  borderRadius: 8,
                }}
              >
                <Text type="secondary">No classroom layout configured</Text>
              </div>
            </Col>
          )}
        </Row>
      )}
    </Content>
  );
};

export default ClassroomManagement;
