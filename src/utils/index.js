import moment from 'moment';
import { notification } from 'antd';
export const fetcher = async (url, options = {}) => {
  // const headers = {
  //   Authorization: 'Bearer YOUR_ACCESS_TOKEN',
  //   ...options.headers,
  // };

  return await fetch(url, { ...options }).then((res) => res.json());
};

export const dateRanges = {
  Today: [moment(), moment()],
  'This Week': [moment().startOf('week'), moment().endOf('week')],
  'Last Week': [
    moment().add(-1, 'week').startOf('week'),
    moment().add(-1, 'week').endOf('week'),
  ],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'This Year': [moment().startOf('year'), moment().endOf('year')],
};

export const openNotification = (message, isError, description = '') => {
  const fn = isError ? 'error' : 'success';

  notification[fn]({
    message,
    description,
    placement: 'bottom',
  });
};

export const disableRefetchBlock = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};


export const getLoggedInUser = () => {
  const yuktaStr = process.browser
    ? window.localStorage.getItem('yukta')
    : '';
  let yukta;
  if (isJsonParsable(yuktaStr)) {
    yukta = JSON.parse(yuktaStr);
  }
  return yukta;
};

export function isJsonParsable(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}