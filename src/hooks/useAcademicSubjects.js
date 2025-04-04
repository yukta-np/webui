import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher, disableRefetchBlock } from '../utils';
import { useMemo } from 'react';

export function useAcademicSubjects(params) {
  const queryString = useMemo(() => {
    if (!params || Object.keys(params).length === 0) return '';
    return new URLSearchParams(params).toString();
  }, [params]);

  const URL = constants.urls.academicSubjectsUrl;
  const fullUrl = queryString ? `${URL}?${queryString}` : URL;

  const { disableAutoRefetch } = params || {};
  const autoRefetchConfig = disableAutoRefetch ? disableRefetchBlock : null;

  const {
    data: responseData,
    error,
    isValidating,
  } = useSWR(fullUrl, fetcher, autoRefetchConfig);

  const revalidate = () => mutate(fullUrl);

  return {
    subjects: responseData?.data,
    meta: responseData?.meta,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
