import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.usersUrl;

export async function createUser(data) {
  return axios.post(URL, data, { headers });
}

export async function updateUser(id, data) {
  return axios.patch(`${URL}/${id}`, data, { headers });
}

export async function deleteUser(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getUser(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
