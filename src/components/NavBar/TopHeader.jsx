import React from 'react';
import { Layout, Input, Space, Avatar, Grid, theme, Badge } from 'antd';
import { BellOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

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
          marginTop: '24px',
          flex: 1,
          maxWidth: screens.md ? '400px' : '100%',
        }}
      >
        <Search
          placeholder="Search..."
          onSearch={onSearch}
          allowClear
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
      

        <Space
          direction="horizontal"
          size="small"
          align="center"
          style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}
          className="user-hover"
        >
          <Avatar
            size={screens.xs ? 'default' : 'large'}
            style={{
              backgroundColor: '#87d068',
              transition: 'transform 0.2s',
              ':hover': { transform: 'scale(1.1)' },
            }}
            icon={<UserOutlined />}
          />
          {screens.md && (
            <div
              style={{
                textAlign: 'right',
                marginLeft: '8px',
                lineHeight: '1.2',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: colorTextSecondary,
                }}
              >
                Dip Ojha
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  color: colorTextSecondary,
                  opacity: 0.8,
                }}
              >
                Admin
              </span>
            </div>
          )}
        </Space>
      </Space>
    </Header>
  );
};

export default TopHeader;
