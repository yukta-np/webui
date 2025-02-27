import React from 'react';
import { Layout, Input, Space, Avatar, Grid, theme, Badge } from 'antd';
import { BellOutlined, NotificationOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

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
        }}
      >
        <Space
        className='mr-6 flex flex-row '>
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
                fontSize: screens.xs ? '20px' : '24px',
                color: colorTextSecondary,
                transition: 'color 0.3s',
                ':hover': { color: colorPrimary },
                gap: '8px',
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
                fontSize: screens.xs ? '20px' : '24px',
                color: colorTextSecondary,
                transition: 'color 0.3s',
                ':hover': { color: colorPrimary },
                gap: '8px',
              }}
            />
          </Badge>
        </Space>

        {/* avatar */}
        <Space>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{
              backgroundColor: colorBgContainer,
              color: colorTextSecondary,
              cursor: 'pointer',
            }}
          />
          <Space direction="vertical">Admin</Space>
        </Space>
      </Space>
    </Header>
  );
};

export default TopHeader;
