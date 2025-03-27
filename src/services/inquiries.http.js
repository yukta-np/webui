import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.inquiryUrl;

export async function createInquiry(inquiry) {
  return axios.post(URL, inquiry, { headers });
}

export async function updateInquires(id, inquiry) {
  return axios.patch(`${URL}/${id}`, inquiry, { headers });
}

export async function deleteInquiries(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}

