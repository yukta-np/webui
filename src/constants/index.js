export const API_URL = 'http://localhost:3999';
export const PREFIX = 'v0';
export const URL = `${API_URL}/${PREFIX}`;

export const COOKIE_SIDEBER_COLLAPSED = 'yukta.ui.sidebar.collapsed';

export const constants = {
   urls: {
      loginUrl: `${URL}/auth/login`,
      registerUrl: `${URL}/auth/register`,
      userUrl: `${URL}/user`,
      taskUrl: `${URL}/task`,
      taskTypeUrl: `${URL}/task-type`,
      taskStatusUrl: `${URL}/task-status`,
      taskCategoryUrl: `${URL}/task-category`,
      taskPriorityUrl: `${URL}/task-priority`,
      organisationsUrl: `${URL}/organisations`,
   }
};

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
}