import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.announcementUrl}`;

export function useAnnouncement() {
   const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

   const revalidate = () => mutate(URL);

   return {
      announcement: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
