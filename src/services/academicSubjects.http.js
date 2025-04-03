import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.academicSubjectsUrl;

export async function createAcademicSubject(data) {
  return axios.post(URL, data, { headers });
}

export async function updateAcademicSubject(id, data) {
  return axios.patch(`${URL}/${id}`, data, { headers });
}

export async function deleteAcademicSubject(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getAcademicSubjectById(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
