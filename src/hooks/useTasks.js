import { constants } from '@/constants';
import useSWR from 'swr';
import { fetcher, disableRefetchBlock } from '../utils';
import { useMemo } from 'react';

export function useTasks(params) {
  const queryString = useMemo(() => {
    if (!params || Object.keys(params).length === 0) return '';
    return new URLSearchParams(params).toString();
  }, [params]);

  const URL = constants.urls.tasksUrl;
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
    taskList: responseData?.data,
    meta: responseData?.meta,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
