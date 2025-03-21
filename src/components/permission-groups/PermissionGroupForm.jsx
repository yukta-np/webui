import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Checkbox,
  Card,
} from 'antd';

import axios from 'axios';
import useSWR from 'swr';
import { constants, headers, Actions } from '../../constants';
import { useRouter } from 'next/router';
import {
  flatten,
  unflatten,
  Roles,
  humanize,
  openNotification,
  fetcher,
} from '../../utils';
import { useAppContext } from '../../app-context';
import { resources } from '@/utils/resources';

const PermissionGroupForm = () => {
  const { loggedInUser } = useAppContext();
  const router = useRouter();
  const [form] = Form.useForm();

  const [action, setAction] = useState(Actions.add);
  const [id, setId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkedAllResources, setCheckedAllResources] = useState([]);

  const { id: gId } = router.query;

  const { data: groupData } = useSWR(
    gId ? `${constants.urls.permissionGroupUrl}/${gId}` : null,
    fetcher
  );

  useEffect(() => {
    if (groupData) {
      setAction(Actions.edit);
      setId(gId);
      setGroup(groupData);
      const { permissions } = groupData;
      const per = flatten(permissions);
      delete group?.permissions;
      let g = { ...group, ...per, name: groupData.name };
      form.setFieldsValue(g);
    }
  }, [groupData]);

  const { data: usersData } = useSWR(
    `${constants.urls.usersUrl}?sort=firstName&limit=500&role[]=${Roles.MANAGER}&role[]=${Roles.ADMIN}&role[]=${Roles.TEACHER}`,
    fetcher
  );

  useEffect(() => {
    if (usersData) {
      setUsers(usersData.data);
    }
  }, [usersData]);

  const onFinish = async (values) => {
    const permissions = unflatten(values);

    delete permissions.name;

    const dValues = {
      name: values.name,
      permissions,
    };

    let axiosRequest;
    let url;
    let res;
    if (action === 'add') {
      axiosRequest = axios.post;
      url = constants.urls.permissionGroupUrl;
    } else {
      axiosRequest = axios.patch;
      url = `${constants.urls.permissionGroupUrl}/${gId}`;
    }

    try {
      setIsProcessing(true);
      res = await axiosRequest(url, dValues, { headers });
      setIsProcessing(false);
      openNotification(`Successfully ${action}ed.`);
      if (action === 'add') {
        router.push(`/permission-groups/${res.data.id}/edit`);
      }
    } catch (e) {
      setIsProcessing(false);
      if (e.response && e.response.data) {
        setAlertMessage(e.response.data.message);
      }
      console.error(e);
    }
  };

  const getChildrenActions = (e) => {
    const { name, checked } = e.target;
    // const resource = resources.find(r => r.name === name);
    if (checked) {
      setCheckedAllResources([...checkedAllResources, name]);
    } else {
      setCheckedAllResources(checkedAllResources.filter((c) => c !== name));
    }
  };

  const isEditable =
    loggedInUser?.role === Roles.ADMIN ||
    (loggedInUser?.permissions?.permissionGroup?.create === true &&
      router.pathname.endsWith('/new')) ||
    (loggedInUser?.permissions?.permissionGroup?.update === true &&
      router.pathname.endsWith('/edit'));

  const renderCard = (resource, parent) => {
    return (
      <>
        {resource.actions.map((action, i) => (
          <Form.Item
            name={`${resource.name}.${action}`}
            valuePropName="checked"
            className="mb-0"
            key={i}
            initialValue={false}
          >
            <Checkbox disabled={!isEditable}> {humanize(action)}</Checkbox>
          </Form.Item>
        ))}
      </>
    );
  };

  const renderPermissions = (resource) => {
    return (
      <Col span={resource.children?.length ? 24 : 6} key={resource.title}>
        <Card
          title={
            !resource.children?.length ? (
              <>
                {resource.title}
              </>
            ) : (
              resource.title
            )
          }
          type="inner"
          className="mb-5"
        >
          {resource.children?.length && resource.actions.length ? (
            <Card
              title={
                <>
                  {resource.title}
                </>
              }
              type="inner"
              className="mb-5"
            >
              {renderCard(resource)}
            </Card>
          ) : (
            renderCard(resource)
          )}

          <Row gutter={24}>
            {resource.children?.map((c, i) => (
              <Col span={6} key={i}>
                <Card
                  title={
                    <>
                      {c.title}
                    </>
                  }
                  type="inner"
                  className="mb-5"
                >
                  {renderCard(c, resource)}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    );
  };

  return (
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Typography.Title level={3}>
        {action === 'add' ? 'Add' : 'Edit'} Permission Group
      </Typography.Title>

      <Divider />
      {alertMessage && (
        <Alert
          description={alertMessage}
          type="error"
          onClose={() => setAlertMessage(null)}
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={6}>
            <Typography.Title level={5}>
              Permission Group Information
            </Typography.Title>
          </Col>
          <Col span={18}>
            <div className="site-layout-background" style={{ padding: 20 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Name"
                    name="name"
                    tooltip="This is a required field"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter name',
                      },
                    ]}
                  >
                    <Input disabled={!isEditable} placeholder="Name" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>
            <h2>Permissions</h2>
          </Col>
          <br />
          <Col span={18}>
            <div className="site-layout-background" style={{ padding: 20 }}>
              <Row gutter={16}>
                {resources.map((resource) => renderPermissions(resource))}
              </Row>
            </div>
            <Divider />
            {isEditable && (
              <Button type="primary" htmlType="submit" loading={isProcessing}>
                Save
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PermissionGroupForm;
