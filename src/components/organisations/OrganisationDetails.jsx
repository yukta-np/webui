import React from 'react';
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Divider,
  Row,
  Col,
  Space,
  Typography,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useOrganisation } from '@/hooks/useOrganisation';

const { Title, Text } = Typography;

const OrganisationDetails = () => {
  const router = useRouter();
  const currentId = parseInt(router.query.id);
  const { organisation } = useOrganisation();
  const orgData = organisation?.find((org) => org.id === currentId);

  return (
    <div className="p-4 ml-4">
      <Divider orientation="left" className="mt-6">
        <p className="text-xl font-bold">Organisation Details</p>
      </Divider>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name" span={2}>
              <Text strong>{orgData?.name || '-'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={orgData?.status === 'active' ? 'green' : 'red'}>
                {orgData?.status?.toUpperCase() || '-'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Plan">
              {orgData?.plan || 'No plan assigned'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {orgData?.createdAt || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {orgData?.updatedAt || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider orientation="left" className="mt-6">
        <p className="text-xl font-bold">Contact</p>
      </Divider>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Email">
              {orgData?.contact?.email || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {orgData?.contact?.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {orgData?.contact?.address || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider orientation="left" className="mt-6">
        <p className="text-xl font-bold">Usage Statistics</p>
      </Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small" title="Users">
            <Title level={3}>{orgData?.stats?.users || 0}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" title="Storage Used">
            <Title level={3}>
              {orgData?.stats?.storage ? `${orgData.stats.storage} GB` : '0 GB'}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" title="Active Modules">
            <Title level={3}>{orgData?.stats?.modules || 0}</Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrganisationDetails;
