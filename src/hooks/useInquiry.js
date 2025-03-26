import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = constants.urls.inquiryUrl;
export function useInquiry() {
const {
      data: responseData,
      error,
      isValidating,
   } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      inquiries: responseData,
      meta: responseData?.meta,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
