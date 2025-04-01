import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

export function useModules() {
  const URL = `${constants.urls.organisationsUrl}/modules`;

  const revalidate = () => mutate(URL);
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);
  return {
    modules: responseData?.data,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
