import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.planTemplateUrl;

export async function createPlan(data) {
  return axios.post(URL, data, { headers });
}

export async function updatePlan(id, data) {
  return axios.patch(`${URL}/${id}`, data, { headers });
}

export async function deletePlan(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getPlanById(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
