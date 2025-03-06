import axios from 'axios';
import { constants } from '@/constants';

const URL = constants.urls.tasksUrl;

export async function createTask(task) {
  return axios.post(URL, task);
}

export async function updateTask(id, task) {
  return axios.patch(`${URL}/${id}`, task);
}

export async function deleteTask(id) {
  return axios.delete(`${URL}/${id}`);
}
