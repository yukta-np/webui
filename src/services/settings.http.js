import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.studentsUrl;

export async function createStudent(student) {
   return axios.post(URL, student, { headers });
}

export async function updateStudent(id, student) {
   return axios.patch(`${URL}/${id}`, student, { headers });
}

export async function deleteStudent(id) {
   return axios.delete(`${URL}/${id}`, { headers });
}

export async function getStudent(id) {
   return axios.get(`${URL}/${id}`, { headers });
}

export async function getAllStudents() {
   return axios.get(URL, { headers });
}

export async function assignGuardian(studentId, guardianId) {
   return axios.patch(`${URL}/${studentId}/guardian`, { guardianId }, { headers });
}

export async function updateGuardian(studentId, guardian) {
   return axios.patch(`${URL}/${studentId}/guardian`, guardian, { headers });
}

export async function deleteGuardian(studentId) {
   return axios.delete(`${URL}/${studentId}/guardian`, { headers });
}
