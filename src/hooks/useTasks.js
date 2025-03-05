import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.taskUrl}`;

export function useTasks() {
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

  const revalidate = () => mutate(URL);

  return {
    tasks: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
