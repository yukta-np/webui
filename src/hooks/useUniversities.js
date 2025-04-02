import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

export function useUniversities(id) {
  const URL = `${constants.urls.universitiesUrl}`;
  const AURL = id ? `${URL}/${id}` : URL;
  const revalidate = () => mutate(AURL);
  const { data: responseData, error, isValidating } = useSWR(AURL, fetcher);

  return {
    universities: responseData,
    universityById: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
