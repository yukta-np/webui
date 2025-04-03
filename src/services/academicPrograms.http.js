import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.academicProgramsUrl;

export async function createAcademicProgram(data) {
  return axios.post(URL, data, { headers });
}

export async function updateAcademicProgram(id, data) {
  return axios.patch(`${URL}/${id}`, data, { headers });
}

export async function deleteAcademicProgram(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getAcademicProgramById(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
