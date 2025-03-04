import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.taskPriorityUrl}`;

export function useTaskPriority() {
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

  const revalidate = () => mutate(URL);

  return {
    taskPriority: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
