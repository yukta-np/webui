import { constants } from '@/constants';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils';

const URL = `${constants.urls.planTemplateUrl}`;

export function usePlanTemplate() {
  const { data: responseData, error, isValidating } = useSWR(URL, fetcher);

  const revalidate = () => mutate(URL);

  return {
    plans: responseData,
    isLoading: isValidating,
    isError: error,
    revalidate,
  };
}
