// app/http/student.http.js
import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.studentUrl;

export const studentService = {
   createStudent: (student) => axios.post(URL, student, { headers }),
   updateStudent: (id, student) => axios.patch(`${URL}/${id}`, student, { headers }),
   deleteStudent: (id) => axios.delete(`${URL}/${id}`, { headers }),
   getStudent: (id) => axios.get(`${URL}/${id}`, { headers }),
   getStudents: (params) => axios.get(URL, { headers, params }),
};