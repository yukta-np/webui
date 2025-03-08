import axios from 'axios';
import { constants } from '@/constants';

const URL = constants.urls.leaveRequestUrl;

export async function createLeaves(leaves) {
  return axios.post(URL, leaves);
}

export async function updateLeaves(id, leaves) {
  return axios.patch(`${URL}/${id}`, leaves);
}

export async function deleteLeaves(id) {
  return axios.delete(`${URL}/${id}`);
}
