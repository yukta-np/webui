import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

export function useUniversities() {
   const { data: responseData, error, isValidating } = useSWR(constants.urls.universitiesUrl, fetcher);

   const revalidate = () => mutate(constants.urls.universitiesUrl);

   return {
      universities: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}

