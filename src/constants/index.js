export const API_URL = 'http://localhost:3999';
export const PREFIX = 'v0';
export const URL = `${API_URL}/${PREFIX}`;

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