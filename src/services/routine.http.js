import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.routinesUrl;

export async function createRoutines(routines) {
  return axios.post(URL, routines, { headers });
}

export async function updateRoutines(id, routines) {
  return axios.patch(`${URL}/${id}`, routines, { headers });
}

export async function deleteRoutines(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
