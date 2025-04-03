import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.areasUrl;

export async function createRoutines(areas) {
  return axios.post(URL, areas, { headers });
}

export async function updateRoutines(id, areas) {
  return axios.patch(`${URL}/${id}`, areas, { headers });
}

export async function deleteRoutines(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
