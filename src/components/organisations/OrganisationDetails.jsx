import React from 'react';
import { Card, Descriptions, Tag, Divider, Row, Col, Typography } from 'antd';
import { useOrganisation } from '@/hooks/useOrganisation';
import moment from 'moment';
import { useUsers } from '@/hooks/useUsers';
const { Title, Text } = Typography;

const OrganisationDetails = ({ params: { id } }) => {
  const { organisation } = useOrganisation(id);
  const { users } = useUsers(id);
  const totalUsers = users ? users?.length : 0;

  return (
    <div className="p-4 ml-4">
      <Divider orientation="left" className="mt-6">
        <p className="text-xl font-bold">Organisation Details</p>
      </Divider>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name" span={2}>
              <Text strong>{organisation?.name || '-'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={organisation?.isActive === true ? 'green' : 'red'}>
                {organisation?.isActive === true ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Plan">
              {organisation?.plan || 'No plan assigned'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {organisation?.createdAt || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {organisation?.updatedAt
                ? moment(organisation.updatedAt).format(
                    'MMMM Do YYYY, h:mm:ss a'
                  )
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
              {organisation?.email || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {organisation?.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {organisation?.address || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Website">
              {organisation?.website || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Pan Number">
              {organisation?.panNumber || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Vat Number">
              {organisation?.vatNumber || '-'}
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
              {organisation?.noreplyEmail || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="No reply Phone">
              {organisation?.noreplyPhone || '-'}
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
            <Title level={3}>{totalUsers || 0}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" title="Storage Used">
            <Title level={3}>
              {organisation?.stats?.storage
                ? `${organisation.stats.storage} GB`
                : '0 GB'}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" title="Active Modules">
            <Title level={3}>{organisation?.stats?.modules || 0}</Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrganisationDetails;
