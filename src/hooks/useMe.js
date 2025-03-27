import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.meUrl}`;
export function useMe() {
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

  const revalidate = () => mutate(URL);

  return {
    me: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
