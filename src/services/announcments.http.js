import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.announcementUrl;

export async function createAnnouncement(announcement) {
  return axios.post(URL, announcement, { headers });
}

export async function updateAnnouncement(id, announcement) {
  return axios.patch(`${URL}/${id}`, announcement, { headers });
}

export async function deleteAnnouncement(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function getAnnouncement(id) {
  return axios.get(`${URL}/${id}`, { headers });
}

