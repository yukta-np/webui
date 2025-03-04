import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.taskCategoryUrl}`;

export function useTaskCategory() {
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

  const revalidate = () => mutate(URL);

  return {
    taskCategory: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
