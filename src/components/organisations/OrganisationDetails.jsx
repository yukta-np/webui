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
import { useRouter } from 'next/router';
import { useOrganisation } from '@/hooks/useOrganisation';
import moment from 'moment';

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
              <Tag color={orgData?.isActive === true ? 'green' : 'red'}>
                {orgData?.isActive === true ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Plan">
              {orgData?.plan || 'No plan assigned'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {orgData?.createdAt || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {orgData?.updatedAt
                ? moment(orgData.updatedAt).format('MMMM Do YYYY, h:mm:ss a')
                : '-'}
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
              {orgData?.email || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {orgData?.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {orgData?.address || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Website">
              {orgData?.website || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Pan Number">
              {orgData?.panNumber || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Vat Number">
              {orgData?.vatNumber || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider orientation="left" className="mt-6">
        <p className="text-xl font-bold">Other Details</p>
      </Divider>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="No reply Email">
              {orgData?.noreplyEmail || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="No reply Phone">
              {orgData?.noreplyPhone || '-'}
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
