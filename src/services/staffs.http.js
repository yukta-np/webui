// app/http/staffs.http.js
import { constants, headers } from '@/constants';

import axios from 'axios';

const URL = constants.urls.staffUrl;

export async function createStaff(staff) {
  return axios.post(URL, staff, { headers });
}

export async function updateStaff(id, staff) {
  return axios.patch(`${URL}/${id}`, staff, { headers });
}

export async function deleteStaff(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

export async function createStaffComment(id, comment) {
  return axios.post(`${URL}/${id}/comment`, comment, { headers });
}

export async function getStaffComments(id) {
  return axios.get(`${URL}/${id}/comment`, { headers });
}

export async function updateStaffComment(id) {
  return axios.patch(`${URL}/${id}/comment`, { headers });
}

export async function deleteStaffComment(id, commentId) {
  return axios.delete(`${URL}/${id}/comment/${commentId}`, { headers });
}

export async function getStaffById(id) {
  try {
    const response = await axios.get(`${URL}/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff data:', error.response?.data || error.message);
    return null; // Ensure the caller handles this properly
  }
}

