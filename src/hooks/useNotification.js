import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.leaveTypesUrl}`;

export function useNotification() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      notification: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
