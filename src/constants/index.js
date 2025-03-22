import { getToken } from '@/utils';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL | 'http://localhost:3000';

export const PREFIX = 'v1';
export const URL = `${API_URL}/${PREFIX}`;

// export const URL = 'https://yukta-cms.onrender.com';
// export const URL = 'https://yukta-cms.onrender.com';

export const constants = {
  urls: {
    loginUrl: `${URL}/auth/login`,
    registerUrl: `${URL}/auth/register`,
    verifyUrl: `${URL}/auth/verify`,
    forgotPasswordUrl: `${URL}/auth/forgot-password`,
    meUrl: `${URL}/users/me`,
    usersUrl: `${URL}/users`,
    tasksUrl: `${URL}/tasks`,
    taskTypesUrl: `${URL}/task-types`,
    taskStatusUrl: `${URL}/task-status`,
    taskChangeHistoriesUrl: `${URL}/task-change-histories`,
    roleUrl: `${URL}/role`,
    studentUrl: `${URL}/student`,
    universitiesUrl: `${URL}/universities`,
    organisationsUrl: `${URL}/organisations`,
    taskCategoryUrl: `${URL}/task-category`,
    taskPriorityUrl: `${URL}/task-priority`,
    leaveRequestUrl: `${URL}/leaves`,
    leaveTypesUrl: `${URL}/leave-types`,
    notificationUrl: `${URL}/notification`,
    groupUrl: `${URL}/groups`,
    announcementUrl: `${URL}/announcements`,
    permissionGroupUrl: `${URL}/permission-groups`,
    groupUrl: `${URL}/group`,

    // Socket
    notificationGateway: `${API_URL}/notifications`,
  },
};

export const headers = {
  Authorization: `Bearer ${getToken()}`,
};

export const COOKIE_SIDEBER_COLLAPSED = 'yukta.ui.sidebar.collapsed';

export const Actions = {
  add: 'add',
  edit: 'edit',
  view: 'view',
  clone: 'clon',
};

export const Resources = {
  routines: 'routines',
  tasks: 'tasks',
  taskTypes: 'taskTypes',
  leaveRequest: 'leaveRequest',
  leaveTypes: 'leaveTypes',
  calender: 'calender',
  notification: 'notification',
  users: 'users',
  announcments: 'announcments',
  permissionGroups: 'permissionGroups',
  classroom: 'classroom',
  settings: 'settings',
};

export const ResourceActions = {
  create: 'create',
  list: 'list',
  view: 'view',
  update: 'update',
  publish: 'publish',
  import: 'import',
  export: 'export',
  download: 'download',
  upload: 'upload',
  delete: 'delete',
  cancel: 'cancel',
  archive: 'archive',
  restore: 'restore',
  acknowledegedByList: 'acknowledegedByList',
};
