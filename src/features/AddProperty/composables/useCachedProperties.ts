import { useQuery, useQueryClient } from '@tanstack/vue-query';

import { getPropertiesByOwnerId } from '@/features/AddProperty/services/property.service.ts';

export function useCachedProperties () {
  const queryClient = useQueryClient()

  const queryKey = ['ownerId']

  const query = useQuery({
    queryKey,
    queryFn: getPropertiesByOwnerId,
    staleTime: 1000 * 60 * 5,
    initialData: () => queryClient.getQueryData(queryKey)
  })

  return {
    ...query
  }
}