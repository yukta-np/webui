import { constants } from '@/constants';
import useSWR from 'swr';
import { fetcher, disableRefetchBlock } from '../utils';
import { useMemo } from 'react';

export function useLeaveRequest(params) {
  const queryString = useMemo(() => {
    if (!params || Object.keys(params).length === 0) return '';
    return new URLSearchParams(params).toString();
  }, [params]);

  const URL = constants.urls.leaveRequestUrl;
  const fullUrl = queryString ? `${URL}?${queryString}` : URL;

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
    leaveRequest: responseData,
    meta: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
