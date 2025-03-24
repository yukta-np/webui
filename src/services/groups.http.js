import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.groupUrl;

export async function createGroup(group) {
  return axios.post(URL, group, { headers });
}

export async function updateGroup(id, group) {
  return axios.patch(`${URL}/${id}`, group, { headers });
}

export async function deleteGroup(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}


