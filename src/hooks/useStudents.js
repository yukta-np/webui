// This file is part of the webui project.
import { constants } from '@/constants';
import useSWR from 'swr';
import { fetcher, disableRefetchBlock } from '../utils';
import { useMemo } from 'react';

export function useStudents(params,id) {
   const queryString = useMemo(() => {
      if (!params || Object.keys(params).length === 0) return '';
      return new URLSearchParams(params).toString();
   }, [params]);
   const URL = constants.urls.studentUrl;
   const AURL = id ? `${URL}/${id}` : URL;
   const fullUrl = queryString ? `${AURL}?${queryString}` : AURL;

   const { disableAutoRefetch } = params || {};
   const autoRefetchConfig = disableAutoRefetch ? disableRefetchBlock : null;

   const {
      data: responseData,
      error,
      isValidating,
      mutate,
   } = useSWR(fullUrl, fetcher, autoRefetchConfig);

   const revalidate = () => mutate(fullUrl);

   return {
      students: responseData,
      meta: responseData?.meta,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}