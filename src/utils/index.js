export const fetcher = async (url, options = {}) => {
   const headers = {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      ...options.headers,
   };

   return await fetch(url, { ...options, headers })
      .then(res => res.json());
}