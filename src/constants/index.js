import { getToken } from '@/utils';

export const API_URL = 'http://localhost:4000';

export const PREFIX = 'v1';
export const URL = `${API_URL}/${PREFIX}`;

// export const URL = 'https://yukta-cms.onrender.com';
// export const URL = 'https://yukta-cms.onrender.com';

export const constants = {
  urls: {
    loginUrl: `${URL}/auth/login`,
    registerUrl: `${URL}/auth/register`,
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
    groupUrl: `${URL}/group`,
    announcementUrl: `${URL}/announcement`,
  },
};

export const headers = {
  Authorization: `Bearer ${getToken()}`,
};

export const COOKIE_SIDEBER_COLLAPSED = 'yukta.ui.sidebar.collapsed';

export const ROLES = {
  // SYSTEM ADMIN
  SYSTADMIN: 'SYSTADMIN',

  // ACADEMIC STAFF
  ORG_ADMIN: 'ORGADMIN',
  ORG_MANAGER: 'ORGMANAGER',
  TEACHER: 'TEACHER',
  STAFF: 'STAFF',

  // STUDENT
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};
