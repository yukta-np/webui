import moment from 'moment';
import { notification } from 'antd';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

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
  const yuktaStr =
    typeof window !== 'undefined' && window.localStorage.getItem('yukta');
  let yukta;
  if (yuktaStr && isJsonParsable(yuktaStr)) {
    yukta = JSON.parse(yuktaStr);
  }
  return yukta;
};

export const getToken = () => {
  const yukta = getLoggedInUser(); //|| extractTokenFromQueryString();
  return yukta?.token;
};

export const clearStorageAndRedirect = (returnUrl) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('yukta');
    window.location.href = [null, undefined, '/', 'undefined', 'null'].includes(
      returnUrl
    )
      ? '/auth/login'
      : `/auth/login?return=${returnUrl}`;
  }
  return null;
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

export const getPermission = () => {
  if (typeof window !== 'undefined') {
    return '{}';
  }

  const yukta = getLoggedInUser();

  const perms = yukta?.permissions;
  if (!perms || perms === 'undefined') {
    if (yukta) {
      yukta.permissions = '{}';
      window.localStorage.setItem('yukta', yukta);
    }
    return '{}';
  }
};

/** ========================== UI Helpers ========================== */
// export const openNotification = (message, isError, description = '') => {
//   const fn = isError ? 'error' : 'success';
//   notification[fn]({
//     message,
//     description,
//     placement: 'bottom',
//   });
// };

export const openNotification = (message, isError, description = "") => {
  const fn = isError ? toast.error : toast.success;
  cl("i am called")
  fn(`${message} ${description}`);
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

/** Miscellanios */

export const objectHasValue = (obj) => {
  return (
    obj &&
    Object.values(obj).some((value) => value !== null && value !== undefined)
  );
};

export function humanize(string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function unflatten(data) {
  var result = {};
  for (var i in data) {
    var keys = i.split('.');
    keys.reduce(function (r, e, j) {
      return (
        r[e] ||
        (r[e] = isNaN(Number(keys[j + 1]))
          ? keys.length - 1 == j
            ? data[i]
            : {}
          : [])
      );
    }, result);
  }
  return result;
}

export function flatten(oldObject) {
  const newObject = {};

  flattenHelper(oldObject, newObject, '');

  return newObject;

  function flattenHelper(currentObject, newObject, previousKeyName) {
    for (let key in currentObject) {
      let value = currentObject[key];

      if (value.constructor !== Object) {
        if (previousKeyName == null || previousKeyName == '') {
          newObject[key] = value;
        } else {
          if (key == null || key == '') {
            newObject[previousKeyName] = value;
          } else {
            newObject[previousKeyName + '.' + key] = value;
          }
        }
      } else {
        if (previousKeyName == null || previousKeyName == '') {
          flattenHelper(value, newObject, key);
        } else {
          flattenHelper(value, newObject, previousKeyName + '.' + key);
        }
      }
    }
  }
}

export const Roles = {
  // SYSTEM ADMIN
  SYSADMIN: 'SYSADMIN',

  // ACADEMIC STAFF
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TEACHER: 'TEACHER',
  STAFF: 'STAFF',

  // STUDENT
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};

export const cl = (...args) => console.log(...args);

// validate phone number and email address
export const phoneRegex = /^\+?[1-9]\d{1,14}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;