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
  Form,
  Divider,
} from 'antd';
import { Bell, Megaphone, Search as SearchIcon } from 'lucide-react';
import {
  clearStorageAndRedirect,
  fetcher,
  setSessionStorageData,
  token,
} from '@/utils';
import useSWRImmutable from 'swr/immutable';
import { constants, headers } from '@/constants';
import Link from 'next/link';
import useWebSocket from '@/hooks/useWebsocket';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import axios from 'axios';
import { Roles } from '@/utils';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const TopHeader = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const [isAnnouncementPopupOpen, setIsAnnouncementPopupOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] =
    useState(false);
  const [loggedInUser, setLoggedInUser] = useState();
  const [notifications, setNotifications] = useState([]);
  const [impersonateForm] = Form.useForm();

  const { announcements } = useAnnouncement(
    { disableAutoRefetch: true },
    { shared: true }
  );
  const meUrl = constants.urls.meUrl;
  const { data: userData } = useSWRImmutable(meUrl, fetcher);

  const { socket, socketConnected } = useWebSocket();

  useEffect(() => {
    if (userData) {
      setLoggedInUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (socket) {
      console.log({ socket, socketConnected });
      if (socketConnected) {
        socket.on('onNotification', (data) => {
          console.log('Notification received:', data);

          setNotifications((prev) => [data, ...prev]);
        });
      }
    }
  }, [socket, socketConnected]);

  const {
    token: { colorBgContainer, colorTextSecondary, borderRadiusLG },
  } = theme.useToken();
  const screens = useBreakpoint();
  const isSysAdmin = loggedInUser?.role === Roles.SYSADMIN;

  const onLogout = () => {
    clearStorageAndRedirect();
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const openImpersonateModal = () => {
    setIsImpersonateModalOpen(true);
  };
  const closeImpersonateModal = () => {
    setIsImpersonateModalOpen(false);
  };

  const onImpersonateSubmit = async () => {
    try {
      const data = impersonateForm.getFieldsValue();

      const response = await axios.post(constants.urls.impersonateUrl, data, {
        headers,
      });
      if (response.status === 200) {
        setIsImpersonateModalOpen(false);
      }
      const { token } = response.data;
      setSessionStorageData(token);
      window.location.href = '/';
    } catch (error) {
      console.error('Impersonation failed:', error);
    }
  };

  const menuItems = [
    {
      label: <Link href="/users/my-profile">Profile</Link>,
      key: 1,
    },
    {
      key: 3,
      label: <Link href="/users/security">Security</Link>,
      onClick: () => console.log('Settings Clicked'),
    },
    {
      type: 'divider',
    },
    {
      key: 4,
      label: 'Logout',
      danger: true,
      onClick: onLogout,
    },
  ];

  if (isSysAdmin) {
    menuItems.splice(1, 0, {
      key: 2,
      label: 'Impersonate',
      onClick: () => openImpersonateModal(),
    });
  }

  const renderPopupContent = (items, type) => (
    <div style={{ width: 300 }}>
      <List
        dataSource={items?.slice(0, 3)}
        renderItem={(item) => (
          <List.Item
            style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <List.Item.Meta
              title={item?.title}
              description={
                <>
                  <div style={{ fontSize: 12 }}>{item?.description}</div>
                  <div style={{ color: colorTextSecondary, fontSize: 10 }}>
                    {item?.date}
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
              title={item?.title}
              description={
                <>
                  <div>{item?.description}</div>
                  <div style={{ color: colorTextSecondary, fontSize: 12 }}>
                    {item?.date}
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
            prefix={<SearchIcon stroke={colorTextSecondary} />}
            style={{
              borderRadius: borderRadiusLG,
              backgroundColor: '#f5f5f5',
              width: '100%',
            }}
            onClick={openSearchModal}
          />
        )}
      </div>

      <Modal
        title="Search"
        open={isSearchModalOpen}
        onCancel={closeSearchModal}
        footer={null}
        width="80%"
        style={{ top: 65, left: 40 }}
      >
        <Input.Search
          placeholder="Type to search..."
          allowClear
          onSearch={(value) => console.log(value)}
        />
      </Modal>

      <Modal
        title="Impersonate"
        open={isImpersonateModalOpen}
        onCancel={closeImpersonateModal}
        onOk={() => impersonateForm.submit()}
      >
        <Divider />
        <Form
          form={impersonateForm}
          onFinish={onImpersonateSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            type="email"
            rules={[
              {
                required: true,
                message: 'Please enter an email',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Form>
        <Divider />
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
              count={notifications?.length}
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
              count={announcements?.length}
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
                  {loggedInUser?.fullName
                    ?.split(' ')
                    .map((name) => name[0].toUpperCase())
                    .join('')}
                </Avatar>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    lineHeight: 1.25,
                  }}
                >
                  <p className="m-0">{loggedInUser?.fullName}</p>
                  <p className="m-0 text-[10px] text-gray-500">
                    {loggedInUser?.role?.toUpperCase()}
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
