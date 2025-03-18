import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.tasksUrl;

export async function createTask(task) {
  return axios.post(URL, task, { headers });
}

export async function updateTask(id, task) {
  console.log('status', task);
  return axios.patch(`${URL}/${id}`, task, { headers });
}

export async function deleteTask(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
