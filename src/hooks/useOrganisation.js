import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

export function useOrganisation(id) {
  const URL = `${constants.urls.organisationsUrl}`;
  const AURL = id ? `${URL}/${id}` : URL;
  const revalidate = () => mutate(AURL);
  const { data: responseData, error, isValidating } = useSWR(AURL, fetcher);
  return {
    organisation: responseData?.data,
    organisationById: responseData,
    meta: responseData?.meta,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
