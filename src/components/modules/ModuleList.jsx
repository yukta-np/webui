import React, { useEffect, useState } from 'react';
import { Card, Switch, Space, Button, Row, Col, Form } from 'antd';
import modulesData from '@/../data/modules.json';
import { updateOrganisation } from '@/services/organisations.http';
import { openNotification } from '@/utils';
import { useOrganisation } from '@/hooks/useOrganisation';

const ModuleList = ({ params: { id } }) => {
  const [form] = Form.useForm();
  const [isProcessing, setIsProcessing] = useState(false);
  const { revalidate } = useOrganisation();

  const initializeEnabledModules = () => {
    const initialState = {};
    modulesData.forEach((module) => {
      initialState[module.key] = false;
    });

    return initialState;
  };

  const [enabledModules, setEnabledModules] = useState(
    initializeEnabledModules
  );

  const { organisationById: organisation } = useOrganisation(id);
  useEffect(() => {
    if (organisation) {
      const initialModules = {};
      modulesData.forEach((module) => {
        initialModules[module.key] =
          organisation.modules?.[module.key] || false;
      });

      setEnabledModules(initialModules);
    }
  }, [organisation]);

  const onToggle = (moduleKey, checked) => {
    setEnabledModules((prev) => ({
      ...prev,
      [moduleKey]: checked,
    }));
  };

  const onSubmit = async () => {
    setIsProcessing(true);
    try {
      const activeModules = {};
      Object.keys(enabledModules).forEach((key) => {
        if (enabledModules[key] === true) {
          activeModules[key] = true;
        }
      });
      const payload = {
        modules: activeModules,
      };
      await updateOrganisation(id, payload);
      openNotification('Modules updated successfully');
      revalidate();
      form.resetFields();
    } catch (error) {
      console.error('Error updating user:', error);
      openNotification('Failed to update user', true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="p-4 ml-2">
        <p className="text-lg font-semibold mb-4">Modules</p>
        <Form form={form} onFinish={onSubmit}>
          <Row gutter={[16, 16]}>
            {modulesData.map((module) => (
              <Col key={module.key} span={12}>
                <Card className="w-full rounded-lg shadow-sm relative h-full">
                  <div className="absolute top-4 right-4">
                    <Switch
                      checked={enabledModules[module.key]}
                      onChange={(checked) => onToggle(module.key, checked)}
                    />
                  </div>
                  <div className="pr-10">
                    <p className="font-semibold text-lg mb-1">{module.name}</p>
                    <p className="text-sm text-gray-500">
                      {module.description}
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            type="primary"
            className="mt-3 float-right"
            onClick={() => form.submit()}
          >
            Save
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ModuleList;
