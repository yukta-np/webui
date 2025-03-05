import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.roleUrl}`;

export function useRoles() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      roles: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
