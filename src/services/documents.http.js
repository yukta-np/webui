import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.documentsUrl;

export async function createDocument(documents) {
  return axios.post(`${URL}/`, documents, {
    headers,
    'Content-Type': 'multipart/form-data',
  });
}

export async function updateDocument(id, documents) {
  return axios.patch(`${URL}/${id}`, documents, { headers });
}

export async function deleteDocument(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
