import { constants } from '@/constants';
import useSWR from 'swr';
import { fetcher, disableRefetchBlock } from '../utils';
import { useMemo } from 'react';

export function useFiles(params) {
  const { disableAutoRefetch, ...otherParams } = params || {};

  const queryString = useMemo(() => {
    if (!otherParams || Object.keys(otherParams).length === 0) return '';
    return new URLSearchParams(params).toString();
  }, [params]);

  const URL = constants.urls.filesUrl;
  const fullUrl = queryString ? `${URL}?${queryString}` : URL;
  const autoRefetchConfig = disableAutoRefetch ? disableRefetchBlock : null;

  const {
    data: responseData,
    error,
    isValidating,
    mutate,
  } = useSWR(fullUrl, fetcher, autoRefetchConfig);

  const revalidate = () => mutate(fullUrl);

  return {
    filesList: responseData?.data,
    meta: responseData?.meta,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
