import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { useAreas } from '@/hooks/useAreas';

const { Title, Text } = Typography;

const {
  areas,
  isLoading: isRoutinesLoading,
  error: routinesError,
} = useAreas();
const Bench = ({ capacity, columnIndex, benchIndex }) => {
  return (
    <Card
      title={`Bench ${benchIndex + 1}`}
      style={{ width: 120, textAlign: 'center' }}
      headStyle={{ padding: '0 8px', minHeight: 'auto' }}
      bodyStyle={{ padding: '8px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '40px',
        }}
      >
        <Text strong>
          {capacity} student{capacity !== 1 ? 's' : ''}
        </Text>
      </div>
      <Text type="secondary" style={{ fontSize: '10px' }}>
        Col {columnIndex + 1}
      </Text>
    </Card>
  );
};

const ClassroomManagement = ({
  structure = [
    [3, 2],
    [3, 2, 2],
  ],
}) => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Classroom Layout
      </Title>

      <Row gutter={[16, 16]} justify="center">
        {structure.map((column, columnIndex) => (
          <Col key={`column-${columnIndex}`}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
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
  );
};

export default ClassroomManagement;
