import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.usersUrl;

export async function createUser(user) {
  return axios.post(URL, user, { headers });
}

export async function updateUser(id, user) {
  return axios.patch(`${URL}/${id}`, user, { headers });
}

export async function deleteTask(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getUser(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
