// export const API_URL = 'http://localhost:3004';
// export const PREFIX = 'v0';
// export const URL = `${API_URL}/${PREFIX}`;

export const URL = 'https://yukta-cms.onrender.com';

export const constants = {
  urls: {
    loginUrl: `${URL}/auth/login`,
    registerUrl: `${URL}/auth/register`,
    userUrl: `${URL}/user`,
    taskUrl: `${URL}/tasks`,
    taskTypeUrl: `${URL}/task-type`,
    taskStatusUrl: `${URL}/task-status`,
    organisationsUrl: `${URL}/organisations`,
    taskCategoryUrl: `${URL}/task-categories`,
    taskPriorityUrl: `${URL}/task-priorities`,
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
