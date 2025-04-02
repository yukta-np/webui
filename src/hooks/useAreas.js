import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher} from '../utils';
import { useMemo } from 'react';


export function useAreas(params) {
     const queryString = useMemo(() => {
       if (!params || Object.keys(params).length === 0) return '';
       return new URLSearchParams(params).toString();
     }, [params]);

     const URL = constants.urls.areasUrl;
     const fullUrl = queryString ? `${URL}?${queryString}` : URL;
const {
      data: responseData,
      error,
      isValidating,
   } = useSWR(fullUrl, fetcher);

   const revalidate = () => mutate(fullUrl);

   return {
      areas: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
