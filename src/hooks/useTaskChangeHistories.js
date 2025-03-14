import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.taskChangeHistoriesUrl}`;

export function useTaskChangeHistories() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      taskChangeHistories: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
