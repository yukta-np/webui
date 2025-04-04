import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.taskTypesUrl}`;

export function useTaskTypes() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      taskTypes: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
