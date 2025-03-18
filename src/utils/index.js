import moment from 'moment';
import { notification } from 'antd';
import axios from 'axios';

/** ========================== Utility Functions ========================== */
export function isJsonParsable(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export const extractTokenFromQueryString = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }
  return null;
};

/** ========================== Storage Functions ========================== */
// export const setSessionStorageData = (token) => {
//   const {
//     id: userId,
//     firstName,
//     lastName,
//     email,
//     phone,
//     role,
//     preferences,
//     organisationId: orgId,
//     isVerified,
//     isActive,
//     createdAt,
//     updatedAt,
//   } = parseJwt(token);

//   const yukta = {
//     token,
//     userId,
//     subId,
//     fullName: `${firstName} ${lastName}`,
//     email,
//     phone,
//     role,
//     orgId,
//     preferences: preferences ? JSON.parse(preferences) : {},
//     isVerified,
//     isActive,
//     createdAt,
//     updatedAt,
//   };
//   window.localStorage.setItem('yukta', JSON.stringify(yukta));
// };

export const setSessionStorageData = (token) => {
  const {
    role,
    organisationId: orgId,
    userId,
    fullName,
    preferences,
    organisationName: orgName,
    organisationLogo: orgLogo,
    permissions,
  } = parseJwt(token);

  if (process.browser) {
    const yukta = {
      token,
      fullName,
      orgId,
      orgName,
      orgLogo,
      role,
      preferences,
      permissions,
      userId: userId,
    };
    window.localStorage.setItem('yukta', JSON.stringify(yukta));
  }
};
export const getLoggedInUser = () => {
  try {
    const yuktaStr = window.localStorage.getItem('yukta');
    if (yuktaStr && isJsonParsable(yuktaStr)) {
      return JSON.parse(yuktaStr);
    }
  } catch (error) {
    console.error('Error parsing user data from localStorage', error);
  }
  return null;
};

export const getToken = () => {
  const yukta = getLoggedInUser() || extractTokenFromQueryString();
  return yukta?.token;
};

export const clearStorageAndRedirect = (returnUrl) => {
  window.localStorage.removeItem('yukta');
  window.location.href = [null, undefined, '/', 'undefined', 'null'].includes(
    returnUrl
  )
    ? '/auth/login'
    : `/auth/login?return=${returnUrl}`;
};

/** ========================== API Functions ========================== */
export const fetcher = (url, params) => {
  const windowParams = new URLSearchParams(window.location.search);
  const token = windowParams.get('token') ?? getToken();

  const { exp } = parseJwt(token);

  if (exp < new Date().getTime() / 1000) {
    console.debug('Token Expired');
    clearStorageAndRedirect(window.location.href);
  } else {
    const headers = { Authorization: `Bearer ${token}` };
    setSessionStorageData(token);

    return axios.get(url, { headers, params }).then((r) => {
      if (r.status === 401) {
        clearStorageAndRedirect(window.location.href);
      }
      return r.data;
    });
  }
};

export const token = getToken();

/** ========================== UI Helpers ========================== */
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

/** ========================== Date Ranges ========================== */
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
