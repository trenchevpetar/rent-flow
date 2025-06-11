import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getIncomes } from '@/features/Income/ListIncomes/services/incomes.service.ts';

export function useIncomes (propertyId: string) {
  return useQuery({
    queryKey: ['incomes', propertyId],
    queryFn: () => getIncomes(propertyId!),
    enabled: computed(() => !!propertyId),
    staleTime: 1000 * 60 * 5
  })
}