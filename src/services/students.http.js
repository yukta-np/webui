// app/http/student.http.js
import { constants, headers } from '@/constants';

import axios from 'axios';

const URL = constants.urls.studentUrl;

export async function createStudent(student) {
  return axios.post(URL, student, { headers });
}

export async function updateStudent(id, student) {
  return axios.patch(`${URL}/${id}`, student, { headers });
}

export async function deleteStudent(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function createStudentComment(id, comment) {
  return axios.post(`${URL}/${id}/comment`, comment, { headers });
}

export async function getStudentComments(id) {
  return axios.get(`${URL}/${id}/comment`, { headers });
}

export async function updateStudentComment(id) {
  return axios.patch(`${URL}/${id}/comment`, { headers });
}

export async function deleteStudentComment(id, commentId) {
  return axios.delete(`${URL}/${id}/comment/${commentId}`, { headers });
}

// Add to student.http.js
export async function getStudentById(id) {
  return axios.get(`${URL}/${id}`, { headers });
}

