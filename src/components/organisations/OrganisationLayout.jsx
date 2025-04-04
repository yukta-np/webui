import React from 'react';
import { Menu, Layout, Grid, theme, Breadcrumb } from 'antd';
import {
  ChartNoAxesGantt,
  User,
  Component,
  Settings,
  BookUser,
} from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useOrganisation } from '@/hooks/useOrganisation';
import { useAppContext } from '@/app-context';
import { Roles } from '@/utils';

const { useBreakpoint } = Grid;
const { Content } = Layout;

const OrganisationLayout = ({ children }) => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const currentId = parseInt(router.query.id);
  const { organisationById: organisation } = useOrganisation(currentId);
  const { loggedInUser } = useAppContext();

  let menuItems = [];

  if (loggedInUser?.role === Roles.SYSADMIN) {
    menuItems = [
      {
        key: 'details',
        icon: <BookUser size={18} />,
        label: <Link href={`/organisations/${currentId}`}>Details</Link>,
      },
      {
        key: 'plans',
        icon: <ChartNoAxesGantt size={18} />,
        label: <Link href={`/organisations/${currentId}/plans`}>Plans</Link>,
      },
      {
        key: 'users',
        icon: <User size={18} />,
        label: <Link href={`/organisations/${currentId}/users`}>Users</Link>,
      },
      {
        key: 'modules',
        icon: <Component size={18} />,
        label: (
          <Link href={`/organisations/${currentId}/modules`}>Modules</Link>
        ),
      },
      {
        key: 'settings',
        icon: <Settings size={18} />,
        label: (
          <Link href={`/organisations/${currentId}/settings`}>Settings</Link>
        ),
      },
    ];
  } else if (loggedInUser?.role === Roles.ADMIN) {
    menuItems = [
      {
        key: 'details',
        icon: <BookUser size={18} />,
        label: <Link href={`/organisations/${currentId}`}>Details</Link>,
      },
      {
        key: 'settings',
        icon: <Settings size={18} />,
        label: <Link href={`/organisations/1/edit`}>Settings</Link>,
      },
      {
        key: 'notice-template',
        icon: <Settings size={18} />,
        label: <Link href="#">Notice Template</Link>,
      },
    ];
  }

  return (
    <>
      <p className="text-xl font-bold mb-4">{organisation?.name}</p>
      <div className="grid grid-cols-12">
        <Menu
          mode="inline"
          style={{ width: screens.xs ? 180 : 200, height: '60vh' }}
          items={menuItems}
          className="col-span-2"
        />
        <div className="col-span-10"> {children}</div>
      </div>
    </>
  );
};

export default OrganisationLayout;
