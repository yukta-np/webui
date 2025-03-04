import moment from 'moment';
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
