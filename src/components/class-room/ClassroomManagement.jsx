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
} from 'antd';
import { useAreas } from '@/hooks/useAreas';
import { UserOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Bench = ({ capacity, columnIndex, benchIndex }) => {
  // Generate student cards with empty seats
  const renderSeats = () => {
    const seats = [];

    for (let i = 0; i < capacity; i++) {
      const isOccupied = []; // 70% chance of being occupied

      seats.push(
        <Card
          key={`seat-${columnIndex}-${benchIndex}-${i}`}
          size="small"
          style={{
            width: 80,
            marginBottom: 4,
            borderLeft: `4px solid ${isOccupied ? '#52c41a' : '#d9d9d9'}`,
            backgroundColor: isOccupied ? '#f6ffed' : '#fafafa',
          }}
          bodyStyle={{ padding: '4px 8px' }}
        >
          <Space size="small" direction="vertical" align="center">
            {isOccupied ? (
              <>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text ellipsis style={{ fontSize: 12 }}>
                  Student {i + 1}
                </Text>
              </>
            ) : (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Empty
              </Text>
            )}
          </Space>
        </Card>
      );
    }

    return seats;
  };

  return (
    <Card
      title={`Bench ${benchIndex + 1}`}
      style={{
        width: 300,
        marginBottom: 16,
        backgroundColor: '#f0f5ff',
      }}
      headStyle={{
        padding: '0 8px',
        minHeight: 'auto',
        borderBottom: '1px solid #1890ff',
      }}
      bodyStyle={{ padding: '8px' }}
    >
      <div style={{ minHeight: 40 }}>
        {capacity > 0 ? (
          <div style={{ display: 'flex', gap: 16, flexDirection: 'row' }}>
            {renderSeats()}
          </div>
        ) : (
          <Text type="secondary" italic style={{ textAlign: 'center' }}>
            No seats
          </Text>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text type="secondary" style={{ fontSize: 10 }}>
          Col {columnIndex + 1}
        </Text>
        <Text type="secondary" style={{ fontSize: 10 }}>
          {capacity} seat{capacity !== 1 ? 's' : ''}
        </Text>
      </div>
    </Card>
  );
};

const ClassroomManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [classrooms, setClassrooms] = useState([]);

  const [currentClassroom, setCurrentClassroom] = useState(null);

  const { areas, isLoading: isAreasLoading, error: areasError } = useAreas();
  const screens = useBreakpoint();

  // Safely extract areas data from response
  const areasData = areas?.data || [];
  console.log(areasData);

  // Extract structure from the current classroom
  // Filter only classrooms (in case response includes other categories)
  const classroomAreas = (areas || []).filter(
    (area) => area.category === 'classroom'
  );

  // Extract structure from the current classroom
  const getCurrentStructure = () => {
    if (!currentClassroom || classroomAreas.length === 0) return [];

    const currentArea = classroomAreas.find(
      (area) => area.name === currentClassroom
    );
    return currentArea?.structure || [];
  };

  const structure = getCurrentStructure();

  const onAddClick = () => {
    setAction('add');
    setIsModalVisible(true);
  };

  const onClassroomChange = (value) => {
    setCurrentClassroom(value);
  };

  useEffect(() => {
    // Filter areas to only include those with category 'classroom'
    const classroomAreas = areas
      ? areas.filter((area) => area.category === 'classroom')
      : [];

    if (classroomAreas.length === 0) {
      setClassrooms([]); // Explicitly set to empty array if no classroom areas
      return;
    }

    const classrooms = Array.from(new Set(classroomAreas.map((a) => a.name)));
    setClassrooms(classrooms);

    if (!currentClassroom && classrooms.length > 0) {
      setCurrentClassroom(classrooms[0]);
    }
  }, [areas]);

  console.log('areas', areas);

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
              Classroom
            </Title>
          </div>
          <Button type="primary" onClick={onAddClick}>
            Add Class
          </Button>
        </div>
        <Select
          onChange={onClassroomChange}
          className="w-36"
          value={currentClassroom}
          loading={isAreasLoading}
          options={classrooms.map((level, index) => ({
            label: level,
            value: level,
            key: index,
          }))}
        />
        <div style={{ padding: '24px' }}>
          <Row gutter={[16, 16]} justify="center">
            {structure.map((column, columnIndex) => (
              <Col key={`column-${columnIndex}`}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {column.map((capacity, benchIndex) => (
                    <Bench
                      key={`bench-${columnIndex}-${benchIndex}`}
                      capacity={capacity}
                      columnIndex={columnIndex}
                      benchIndex={benchIndex}
                    />
                  ))}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Content>
  );
};

export default ClassroomManagement;
