export const URL = 'http://localhost:4000';
// export const PREFIX = 'v0';
// export const URL = `${API_URL}/${PREFIX}`;

// export const URL = 'https://yukta-cms.onrender.com';

export const constants = {
  urls: {
    loginUrl: `${URL}/auth/login`,
    registerUrl: `${URL}/auth/register`,
    usersUrl: `${URL}/users`,
    tasksUrl: `${URL}/tasks`,
    taskTypesUrl: `${URL}/task-types`,
    taskStatusUrl: `${URL}/task-status`,
    taskChangeHistoriesUrl: `${URL}/task-change-histories`,
    roleUrl: `${URL}/role`,
    studentUrl: `${URL}/student`,
    universitiesUrl: `${URL}/universities`,
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
