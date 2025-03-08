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

export const setSessionStorageData = (token) => {
  const {
    id: userId,
    firstname,
    lastname,
    email,
    phone,
    role,
    preferences,
    organisationId: orgId,
    isVerified,
    isActive,
    createdAt,
    updatedAt,
  } = parseJwt(token);

  const yukta = {
    token,
    userId,
    fullName: `${firstname} ${lastname}`,
    email,
    phone,
    role,
    orgId,
    preferences: preferences ? JSON.parse(preferences) : {},
    isVerified,
    isActive,
    createdAt,
    updatedAt,
  };
  window.localStorage.setItem('yukta', JSON.stringify(yukta));

};

export function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
