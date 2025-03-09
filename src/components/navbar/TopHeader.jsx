import React, { useEffect, useState } from 'react';
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
  Popover,
  List,
} from 'antd';
import { Bell, Megaphone, Search as SearchIcon } from 'lucide-react';
import { fetcher } from '@/utils';
import useSWRImmutable from 'swr/immutable';
import { constants } from '@/constants';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const TopHeader = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const [isAnnouncementPopupOpen, setIsAnnouncementPopupOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] =
    useState(false);
  const [loggedInUser, setLoggedInUser] = useState();

  const meUrl = constants.urls.meUrl;
  const { data: userData } = useSWRImmutable(meUrl, fetcher);

  useEffect(() => {
    if (userData) {
      setLoggedInUser(userData);
    }
  }, [userData]);

  console.log('loggedInUsers', loggedInUser);

  // Dummy data
  const [notifications] = useState([
    {
      id: 1,
      title: 'System Update',
      description: 'Planned maintenance on Friday at 10 PM',
      date: '2024-02-15',
    },
    {
      id: 2,
      title: 'New Message',
      description: 'You have a new message from support',
      date: '2024-02-14',
    },
  ]);

  const [announcements] = useState([
    {
      id: 1,
      title: 'Holiday Notice',
      description: 'Office closed on National Day',
      date: '2024-02-20',
    },
    {
      id: 2,
      title: 'New Feature',
      description: 'Check out the latest updates in v2.0',
      date: '2024-02-18',
    },
  ]);

  const {
    token: { colorBgContainer, colorTextSecondary, borderRadiusLG },
  } = theme.useToken();
  const screens = useBreakpoint();
  // const { loggedInUser } = useAppContext();

  // const loggedInUser = getLoggedInUser();

  // const loggedInUser = {
  //   userId: 8,
  //   fullName: 'Abishek Ghimire',
  //   role: 'Admin',
  // };

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

  const renderPopupContent = (items, type) => (
    <div style={{ width: 300 }}>
      <List
        dataSource={items.slice(0, 3)}
        renderItem={(item) => (
          <List.Item
            style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <List.Item.Meta
              title={item.title}
              description={
                <>
                  <div style={{ fontSize: 12 }}>{item.description}</div>
                  <div style={{ color: colorTextSecondary, fontSize: 10 }}>
                    {item.date}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
      <Button
        type="link"
        block
        onClick={() => {
          type === 'notification'
            ? (setIsNotificationPopupOpen(false),
              setIsNotificationsModalOpen(true))
            : (setIsAnnouncementPopupOpen(false),
              setIsAnnouncementsModalOpen(true));
        }}
      >
        See More
      </Button>
    </div>
  );

  const renderFullScreenContent = (items) => (
    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <List.Item.Meta
              title={item.title}
              description={
                <>
                  <div>{item.description}</div>
                  <div style={{ color: colorTextSecondary, fontSize: 12 }}>
                    {item.date}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

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
          <SearchIcon
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
            prefix={<SearchIcon stroke={colorTextSecondary} />}
            style={{
              borderRadius: borderRadiusLG,
              backgroundColor: '#f5f5f5',
              width: '100%',
            }}
            onClick={() => setIsSearchModalOpen(true)}
          />
        )}
      </div>

      <Modal
        title="Search"
        open={isSearchModalOpen}
        onCancel={() => setIsSearchModalOpen(false)}
        footer={null}
        width="80%"
        style={{ top: 65, left: 40 }}
      >
        <Input.Search
          placeholder="Type to search..."
          allowClear
          enterButton
          onSearch={(value) => console.log(value)}
        />
      </Modal>

      {/* Notifications and User Area */}
      <Space
        size={screens.md ? 'large' : 'middle'}
        align="center"
        style={{ marginLeft: 'auto' }}
      >
        <Space className="mt-3 mr-2 gap-9">
          <Popover
            content={renderPopupContent(notifications, 'notification')}
            trigger="click"
            open={isNotificationPopupOpen}
            onOpenChange={setIsNotificationPopupOpen}
          >
            <Badge
              count={notifications.length}
              style={{
                boxShadow: `0 0 0 2px ${colorBgContainer}`,
                cursor: 'pointer',
              }}
            >
              <Bell stroke={colorTextSecondary} size={20} />
            </Badge>
          </Popover>

          <Popover
            content={renderPopupContent(announcements, 'announcement')}
            trigger="click"
            open={isAnnouncementPopupOpen}
            onOpenChange={setIsAnnouncementPopupOpen}
          >
            <Badge
              count={announcements.length}
              style={{
                boxShadow: `0 0 0 2px ${colorBgContainer}`,
                cursor: 'pointer',
              }}
            >
              <Megaphone stroke={colorTextSecondary} size={20} />
            </Badge>
          </Popover>
        </Space>

        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <a className="ant-dropdown-link">
            <Button type="text">
              <Space className="text-left">
                <Avatar style={{ backgroundColor: '#87d068' }}>
                  {loggedInUser?.firstname?.toUpperCase()[0]}

                </Avatar>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    lineHeight: 1.25,
                  }}
                >
                  <p className="m-0">{loggedInUser?.firstname} {loggedInUser?.lastname}</p>
                  <p className="m-0 text-[10px] text-gray-500">
                    {loggedInUser?.role}
                  </p>
                </div>
              </Space>
            </Button>
          </a>
        </Dropdown>
      </Space>

      {/* Full Screen Modals */}
      <Modal
        title="Notifications"
        open={isNotificationsModalOpen}
        onCancel={() => setIsNotificationsModalOpen(false)}
        width="80%"
        style={{ top: 20 }}
        footer={null}
      >
        {renderFullScreenContent(notifications)}
      </Modal>

      <Modal
        title="Announcements"
        open={isAnnouncementsModalOpen}
        onCancel={() => setIsAnnouncementsModalOpen(false)}
        width="80%"
        style={{ top: 20 }}
        footer={null}
      >
        {renderFullScreenContent(announcements)}
      </Modal>
    </Header>
  );
};

export default TopHeader;
