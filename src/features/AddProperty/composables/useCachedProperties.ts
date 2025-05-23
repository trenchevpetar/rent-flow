import { useQuery, useQueryClient } from '@tanstack/vue-query';

import { getPropertiesById } from '@/features/AddProperty/services/property.service.ts';

export function useCachedProperties (queryKey: string, queryValue: string) {
  const queryClient = useQueryClient()

  if (!queryKey) {
    console.warn(`[useCachedProperties] Invalid queryKey: ${queryKey}`)
    return {
      data: null,
      isPending: false,
      isError: true,
      error: new Error('Invalid queryKey provided'),
    }
  }

  if (!queryValue) {
    console.warn(`[useCachedProperties] Invalid queryValue: ${queryValue}`)
    return {
      data: null,
      isPending: false,
      isError: true,
      error: new Error('Invalid queryValue provided'),
    }
  }

  const fullQueryKey = [queryKey, queryValue]

  return useQuery({
    queryKey: fullQueryKey,
    queryFn: () => getPropertiesById(queryKey, queryValue),
    staleTime: 1000 * 60 * 5,
    initialData: () => queryClient.getQueryData(fullQueryKey)
  })
}