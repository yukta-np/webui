import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';
const URL = `${constants.urls.organisationsUrl}`;

export function useOrganisation() {
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

  const revalidate = () => mutate(URL);

  return {
    organisation: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
