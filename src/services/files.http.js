import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.filesUrl;

export async function createFile(files) {
  return axios.post(`${URL}/`, files, {
    headers,
    'Content-Type': 'multipart/form-data',
  });
}

export async function createFolder(folder) {
  const transformedData = {
    ...folder,
    entity: 'files',
    category: 'myFiles',
    path: JSON.stringify(folder.path),
    isFolder: 'true',
  };
  return axios.post(`${URL}/folder`, transformedData, {
    headers,
  });
}

export async function updateFile(id, files) {
  return axios.patch(`${URL}/${id}`, files, { headers });
}

export async function deleteFile(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
