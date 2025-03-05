// export const API_URL = 'http://localhost:3004';
// export const PREFIX = 'v0';
// export const URL = `${API_URL}/${PREFIX}`;

import { notification } from "antd";

export const URL = 'https://yukta-cms.onrender.com';

export const constants = {
  urls: {
    loginUrl: `${URL}/auth/login`,
    registerUrl: `${URL}/auth/register`,
    userUrl: `${URL}/user`,
    usersUrl: `${URL}/users`, // Added
    taskUrl: `${URL}/task`,
    tasksUrl: `${URL}/tasks`, // Added
    taskTypeUrl: `${URL}/task-type`,
    taskTypesUrl: `${URL}/task-types`, // Added
    taskStatusUrl: `${URL}/task-status`,
    taskChangeHistoriesUrl: `${URL}/task-change-histories`, // Added
    roleUrl: `${URL}/role`, // Added
    studentUrl: `${URL}/student`, // Added
    universitiesUrl: `${URL}/universities`, // Added
    organisationsUrl: `${URL}/organisations`,
    taskCategoryUrl: `${URL}/task-categories`,
    taskPriorityUrl: `${URL}/task-priorities`,
    leaveRequestUrl: `${URL}/leave-request`,
    leaveTypesUrl: `${URL}/leave-types`,
    notificationUrl: `${URL}/notification`,
    groupUrl: `${URL}/group`,
  },

};

export const COOKIE_SIDEBER_COLLAPSED = 'yukta.ui.sidebar.collapsed';

// export const ROLES = {
//    SYSTADMIN: 'SYSTADMIN',

//    PRINCIPAL: 'PRINCIPAL',
//    HOD: 'HOD',
//    TEACHER: 'TEACHER',
//    STAFF: 'STAFF',

//    PARENT: 'PARENT',
//    STUDENT: 'STUDENT',
// }
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
