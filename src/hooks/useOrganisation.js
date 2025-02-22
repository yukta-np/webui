import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';

export function useOrganisation(orgId) {
   const {
      data: responseData,
      error,
      isValidating,
   } = useSWR(
      orgId ? `${constants.urls.organisationsUrl}/${orgId}` : null,
      fetcher,
      disableRefetchBlock
   );

   const revalidate = () =>
      mutate(`${constants.urls.organisationsUrl}/${orgId}`);

   return {
      organisation: responseData,
      isLoading: isValidating,
      isError: error,
      revalidate,
   };
}
