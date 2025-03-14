import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.leaveRequestUrl;

export async function createLeaves(leaves) {
  return axios.post(URL, leaves, { headers });
}

export async function updateLeaves(id, leaves) {
  return axios.patch(`${URL}/${id}`, leaves, { headers });
}

export async function deleteLeaves(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
