import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.universitiesUrl;

export async function createUniversity(data) {
  return axios.post(URL, data, { headers });
}

export async function updateUniversity(id, data) {
  return axios.patch(`${URL}/${id}`, data, { headers });
}

export async function deleteUniversity(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getUniversityById(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
