import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.groupUrl}`;

export function useGroup() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      group: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
