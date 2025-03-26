import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.documentsUrl;

export async function createDocument(documents) {
  return axios.post(`${URL}/upload`, documents, { headers });
}

export async function updateDocument(id, documents) {
  return axios.patch(`${URL}/${id}`, documents, { headers });
}

export async function deleteDocument(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
