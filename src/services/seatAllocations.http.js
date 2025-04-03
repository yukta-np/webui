import axios from 'axios';
import { constants, headers } from '@/constants';

const URL = constants.urls.seatAllocationsUrl;

export async function createSeatAllocations
(seatAllocations) {
  return axios.post(URL, seatAllocations, { headers });
}

export async function updateSeatAllocations
(id, seatAllocations) {
  return axios.patch(`${URL}/${id}`, seatAllocations, { headers });
}

export async function deleteSeatAllocations
(id) {
  return axios.delete(`${URL}/${id}`, { headers });
}
