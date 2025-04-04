import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.organisationsUrl;

export async function createOrganisation(data) {
  return axios.post(URL, data, { headers });
}

export async function updateOrganisation(id, data) {
  return axios.patch(`${URL}/${id}`, data, { headers });
}

export async function deleteOrganisation(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getOrganisationById(id) {
  return axios.get(`${URL}/${id}`, { headers });
}
