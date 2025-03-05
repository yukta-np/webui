import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.leaveRequestUrl}`;

export function useLeaveRequest() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      leaveRequest: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
