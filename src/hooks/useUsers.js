import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.usersUrl}`;

export function useUsers() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      users: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
