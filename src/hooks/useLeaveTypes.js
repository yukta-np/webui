import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.leaveTypesUrl}`;

export function useLeaveTypes() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      leaveTypes: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
