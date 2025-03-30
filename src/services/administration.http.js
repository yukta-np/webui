

// app/http/administration.http.js
import { constants, headers } from '@/constants';

import axios from 'axios';

const URL = constants.urls.administrationUrl;

export async function createAdmin(admin) {
  return axios.post(URL, admin, { headers });
}

export async function updateAdmin(id, admin) {
  return axios.patch(`${URL}/${id}`, admin, { headers });
}

export async function deleteAdmin(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function createAdminComment(id, comment) {
  return axios.post(`${URL}/${id}/comment`, comment, { headers });
}

export async function getAdminComments(id) {
  return axios.get(`${URL}/${id}/comment`, { headers });
}

export async function updateAdminComment(id) {
  return axios.patch(`${URL}/${id}/comment`, { headers });
}

export async function deleteAdminComment(id, commentId) {
  return axios.delete(`${URL}/${id}/comment/${commentId}`, { headers });
}

