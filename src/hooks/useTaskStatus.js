import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.taskStatusUrl}`;

export function useTaskStatus() {
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

  const revalidate = () => mutate(URL);

  return {
    taskStatus: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
