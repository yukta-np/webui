import React, { useState } from 'react';
import { Layout, Input, Space, Avatar, Grid, theme, Badge } from 'antd';
import {
  BellOutlined,
  NotificationOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const onSearch = (value) => console.log(value);

const TopHeader = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
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
        padding: screens.xs ? '0 12px' : '0 24px',
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        height: '64px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          flex: searchExpanded ? 1 : 'none',
          maxWidth: screens.md ? '400px' : 'none',
          transition: 'all 0.3s',
        }}
      >
        {screens.xs && !searchExpanded ? (
          <SearchOutlined
            onClick={() => setSearchExpanded(true)}
            style={{
              fontSize: '20px',
              color: colorTextSecondary,
              cursor: 'pointer',
            }}
          />
        ) : (
          <Input
            placeholder="Search..."
            onSearch={onSearch}
            allowClear
            prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
            style={{
              borderRadius: borderRadiusLG,
              backgroundColor: '#f5f5f5',
              width: '100%',
            }}
            onBlur={() => setSearchExpanded(false)}
            autoFocus={searchExpanded}
          />
        )}
      </div>

      {/* Icons and User Info */}
      <Space
        size={screens.md ? 'large' : 'middle'}
        align="center"
        style={{
          marginLeft: 'auto',
          gap: screens.xs ? '12px' : '24px',
        }}
      >
        <Space size={screens.xs ? 'small' : 'middle'}>
          <Badge
            count={5}
            style={{
              boxShadow: `0 0 0 2px ${colorBgContainer}`,
              cursor: 'pointer',
            }}
          >
            <BellOutlined
              style={{
                fontSize: '20px',
                color: colorTextSecondary,
                transition: 'color 0.3s',
                ':hover': { color: colorPrimary },
              }}
            />
          </Badge>

          <Badge
            count={5}
            style={{
              boxShadow: `0 0 0 2px ${colorBgContainer}`,
              cursor: 'pointer',
            }}
          >
            <NotificationOutlined
              style={{
                fontSize: '20px',
                color: colorTextSecondary,
                transition: 'color 0.3s',
                ':hover': { color: colorPrimary },
              }}
            />
          </Badge>
        </Space>

        {/* Avatar */}
        <Space
          align="center"
          style={{
            gap: screens.xs ? '8px' : '12px',
            marginLeft: screens.xs ? 'auto' : 'none',
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
          {!screens.xs && (
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
          )}
        </Space>
      </Space>
    </Header>
  );
};

export default TopHeader;
