import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.studentUrl}`;

export function useStudents() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      students: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
