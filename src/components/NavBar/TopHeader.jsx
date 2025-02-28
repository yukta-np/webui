import React from 'react';
import { Layout, Input, Space, Avatar, Grid, theme, Badge } from 'antd';
import {
  BellOutlined,
  NotificationOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { Search } = Input;
const { useBreakpoint } = Grid;

const onSearch = (value) => console.log(value);

const TopHeader = () => {
  const {
    token: {
      colorBgContainer,
      colorTextSecondary,
      borderRadiusLG,
      colorPrimary,
    },
  } = theme.useToken();

  const screens = useBreakpoint();

  return (
    <Header
      style={{
        padding: screens.xs ? '0 16px' : '0 24px',
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        height: '64px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          marginRight: '16px',
          flex: 1,
          maxWidth: screens.md ? '400px' : '100%',
        }}
      >
        <Input
          placeholder="Search..."
          onSearch={onSearch}
          allowClear
          prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
          style={{
            borderRadius: borderRadiusLG,
            backgroundColor: screens.xs ? 'transparent' : '#f5f5f5',
            border: screens.xs ? 'none' : '1px solid #d9d9d9',
          }}
          className="custom-search"
        />
      </div>

      {/* Icons and User Info */}
      <Space
        size={screens.md ? 'large' : 'middle'}
        align="center"
        style={{
          marginLeft: 'auto',
          paddingLeft: screens.xs ? '8px' : '16px',
          justifyContent: 'space-between',
          gap: '40px',
          marginRight: '40px',
        }}
      >
        <Badge
          count={5}
          style={{
            marginTop: '24px',
            boxShadow: `0 0 0 2px ${colorBgContainer}`,
            cursor: 'pointer',
          }}
        >
          <BellOutlined
            style={{
              marginTop: '24px',
              fontSize: screens.xs ? '16px' : '20px',
              color: colorTextSecondary,
              transition: 'color 0.3s',
              ':hover': { color: colorPrimary },
            }}
          />
        </Badge>

        <Badge
          count={5}
          style={{
            marginTop: '24px',
            boxShadow: `0 0 0 2px ${colorBgContainer}`,
            cursor: 'pointer',
          }}
        >
          <NotificationOutlined
            style={{
              marginTop: '24px',
              fontSize: screens.xs ? '16px' : '20px',
              color: colorTextSecondary,
              transition: 'color 0.3s',
              ':hover': { color: colorPrimary },
            }}
          />
        </Badge>
      </Space>

      {/* avatar */}
      <Space
        align="center"
        style={{
          marginRight: '30px',
        }}
      >
        <Avatar
          icon={<UserOutlined />}
          style={{
            backgroundColor: colorPrimary,
            color: colorBgContainer,
            cursor: 'pointer',
          }}
        />

        <div style={{ lineHeight: '1.2' }}>
          <p style={{ margin: 0, padding: 0 }}>Abishek Ghimire</p>
          <p
            style={{
              marginTop: '2px',
              padding: 0,
              fontSize: '10px',
              color: 'gray',
            }}
          >
            SYSTADMIN
          </p>
        </div>
      </Space>
    </Header>
  );
};

export default TopHeader;
