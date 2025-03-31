

// app/http/administration.http.js
import { constants, headers } from '@/constants';

import axios from 'axios';

const URL = constants.urls.administrationUrl;

export async function createAdministration(administration) {
  return axios.post(URL, administration, { headers });
}

export async function updateAdministration(id, administration) {
  return axios.patch(`${URL}/${id}`, administration, { headers });
}

export async function deleteAdministration(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function createAdministrationComment(id, comment) {
  return axios.post(`${URL}/${id}/comment`, comment, { headers });
}

export async function getAdministrationComments(id) {
  return axios.get(`${URL}/${id}/comment`, { headers });
}

export async function updateAdministrationComment(id) {
  return axios.patch(`${URL}/${id}/comment`, { headers });
}

export async function deleteAdministrationComment(id, commentId) {
  return axios.delete(`${URL}/${id}/comment/${commentId}`, { headers });
}

