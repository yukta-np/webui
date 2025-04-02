import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.facultiesUrl;

export async function createFaculty(data) {
  return axios.post(URL, data, { headers });
}

export async function updateFaculty(id, data) {
  return axios.patch(`${URL}/${id}`, data, { headers });
}

export async function deleteFaculty(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getFacultyById(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
