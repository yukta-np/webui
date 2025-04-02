import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

export function useFaculties(id) {
  const URL = `${constants.urls.facultiesUrl}`;
  const AURL = id ? `${URL}/${id}` : URL;
  const revalidate = () => mutate(AURL);
  const { data: responseData, error, isValidating } = useSWR(AURL, fetcher);

  return {
    faculties: responseData?.data,
    meta: responseData?.meta,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
