import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.tasksUrl;

export async function createTask(task) {
  return axios.post(URL, task, { headers });
}

export async function updateTask(id, task) {
  return axios.patch(`${URL}/${id}`, task, { headers });
}

export async function deleteTask(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function createComment(id, comment) {
  return axios.post(`${URL}/${id}/comment`, comment, { headers });
}

export async function getComments(id) {
  return axios.get(`${URL}/${id}/comment`, { headers });
}

export async function updateComment(id) {
  return axios.patch(`${URL}/${id}/comment`, { headers });
}

export async function deleteComment(id) {
  return axios.delete(`${URL}/${id}/comment`, { headers });
}
