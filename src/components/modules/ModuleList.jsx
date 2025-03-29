import React, { useState } from 'react';
import { Card, Switch, Space, Button, Row, Col } from 'antd';
import modulesData from '@/../data/modules.json';

const ModuleList = () => {
  const [enabledModules, setEnabledModules] = useState(() => {
    const initialState = {};
    modulesData.forEach((module) => {
      initialState[module.key] = false;
    });
    return initialState;
  });

  const handleToggle = (moduleKey, checked) => {
    setEnabledModules((prev) => ({
      ...prev,
      [moduleKey]: checked,
    }));
  };

  return (
    <>
      <div className="p-4 ml-2">
        <p className="text-lg font-semibold mb-4">Modules</p>
        <Row gutter={[16, 16]}>
          {modulesData.map((module) => (
            <Col key={module.key} span={12}>
              <Card className="w-full rounded-lg shadow-sm relative h-full">
                <div className="absolute top-4 right-4">
                  <Switch
                    checked={enabledModules[module.key]}
                    onChange={(checked) => handleToggle(module.key, checked)}
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
        <Button type="primary" className="mt-3 float-right">
          Save
        </Button>
      </div>
    </>
  );
};

export default ModuleList;
