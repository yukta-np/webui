import React, { useState } from 'react';
import {
  Layout,
  Input,
  Space,
  Avatar,
  Grid,
  theme,
  Badge,
  Modal,
  Dropdown,
  Button,
} from 'antd';
import {
  BellOutlined,
  NotificationOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { Search } = Input;

const TopHeader = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    token: {
      colorBgContainer,
      colorTextSecondary,
      borderRadiusLG,
      colorPrimary,
    },
  } = theme.useToken();
  const screens = useBreakpoint();

  const loggedInUser = {
    avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg', // Replace with an actual image URL
    fullName: 'John Doe',
    role: 'admin', // Example role
  };

  const handleSearchClick = () => {
    console.log('Search button clicked');
    setIsModalOpen(true);
  };
  const getRoleForHumans = (role) => {
    const roles = {
      admin: 'Admin',
      user: 'User',
      editor: 'Editor',
    };
    return roles[role] || 'Unknown Role';
  };

  const isClient = (user) => user.role === 'user';

  const menuItems = [
    {
      key: '1',
      label: 'Profile',
      onClick: () => console.log('Profile Clicked'),
    },
    {
      key: '2',
      label: 'Settings',
      onClick: () => console.log('Settings Clicked'),
    },
    {
      key: '3',
      label: 'Logout',
      danger: true,
      onClick: () => console.log('Logout Clicked'),
    },
  ];

  return (
    <Header
      style={{
        padding: screens.xs ? '0 12px' : '0 24px',
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
            allowClear
            enterButton
            prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
            style={{
              borderRadius: borderRadiusLG,
              backgroundColor: '#f5f5f5',
              width: '100%',
            }}
            onClick={handleSearchClick}
          />
        )}
      </div>

      <Modal
        title="Search"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        height={screens.xs ? '100%' : '60%'}
        width={screens.xs ? '100%' : '50%'}
      >
        <Search
          placeholder="Type to search..."
          allowClear
          enterButton
          onSearch={(value) => console.log(value)}
        />
      </Modal>

      {/* Icons and User Info */}
      <Space
        size={screens.md ? 'large' : 'middle'}
        align="center"
        style={{ marginLeft: 'auto' }}
      >
        <Badge
          count={5}
          style={{
            boxShadow: `0 0 0 2px ${colorBgContainer}`,
            cursor: 'pointer',
          }}
        >
          <BellOutlined
            style={{ fontSize: '20px', color: colorTextSecondary }}
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
            style={{ fontSize: '20px', color: colorTextSecondary }}
          />
        </Badge>

        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <a className="ant-dropdown-link">
            <Button type="text">
              <Space className="text-left">
                {loggedInUser?.avatarUrl ? (
                  <Avatar style={{ marginBottom: '8px' }} src={loggedInUser?.avatarUrl} />
                ) : (
                  <Avatar style={{ backgroundColor: '#87d068' }}>
                    {loggedInUser && loggedInUser?.fullName?.toUpperCase()[0]}
                  </Avatar>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    lineHeight: 1.25, // ! very important code dont delete else you will regret !!!
                  }}
                >
                  <p className="m-0">{loggedInUser?.fullName}</p>
                  {!isClient(loggedInUser) ? (
                    <p className="m-0 text-[10px] text-gray-500">
                      {getRoleForHumans(loggedInUser?.role)}
                    </p>
                  ) : null}
                </div>
              </Space>
            </Button>
          </a>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default TopHeader;
