import React, { useEffect, useState } from 'react';
import { Card, Switch, Button, Row, Col, Form, Spin } from 'antd';
import { updateOrganisation } from '@/services/organisations.http';
import { openNotification } from '@/utils';
import { useOrganisation } from '@/hooks/useOrganisation';
import { useModules } from '@/hooks/useModules';

const ModuleList = ({ params: { id } }) => {
  const [form] = Form.useForm();
  const [isProcessing, setIsProcessing] = useState(false);
  const { revalidate } = useOrganisation();
  const { modules: modulesData = [], isLoading: isModulesLoading } =
    useModules();

  const [enabledModules, setEnabledModules] = useState({});
  const { organisationById: organisation, isLoading: isOrganisationLoading } =
    useOrganisation(id);

  useEffect(() => {
    if (modulesData.length > 0 && organisation) {
      const initialModules = {};
      modulesData.forEach((module) => {
        initialModules[module.key] =
          organisation.modules?.[module.key] || false;
      });
      setEnabledModules(initialModules);
    }
  }, [organisation, modulesData]);

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
      console.error('Error updating modules:', error);
      openNotification('Failed to update modules', true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isModulesLoading || isOrganisationLoading) {
    return <Spin size="large" className="flex justify-center mt-8" />;
  }

  if (!modulesData || modulesData.length === 0) {
    return <div className="p-4">No modules available</div>;
  }

  return (
    <div className="p-4 ml-2">
      <p className="text-lg font-semibold mb-4">Modules</p>
      <Form form={form} onFinish={onSubmit}>
        <Row gutter={[16, 16]}>
          {modulesData.map((module) => (
            <Col key={module.key} span={12}>
              <Card className="w-full rounded-lg shadow-sm relative h-full">
                <div className="absolute top-4 right-4">
                  <Switch
                    checked={enabledModules[module.key] || false}
                    onChange={(checked) => onToggle(module.key, checked)}
                  />
                </div>
                <div className="pr-10">
                  <p className="font-semibold text-lg mb-1">{module.name}</p>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Button
          type="primary"
          className="mt-3 float-right"
          onClick={() => form.submit()}
          loading={isProcessing}
        >
          Save
        </Button>
      </Form>
    </div>
  );
};

export default ModuleList;
