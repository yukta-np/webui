import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher} from '../utils';
import { useMemo } from 'react';


export function useSeatAllocations(params) {
     const queryString = useMemo(() => {
       if (!params || Object.keys(params).length === 0) return '';
       return new URLSearchParams(params).toString();
     }, [params]);

     const URL = constants.urls.seatAllocationsUrl;
     const fullUrl = queryString ? `${URL}?${queryString}` : URL;
const {
      data: responseData,
      error,
      isValidating,
   } = useSWR(fullUrl, fetcher);

   const revalidate = () => mutate(fullUrl);

   return {
      seatAllocations: responseData,
      meta: responseData?.meta,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
