import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.taskUrl}`;

export function useTask() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      task: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
