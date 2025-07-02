import { computed } from 'vue'

import { useCachedProperties } from '@/features/Property/AddProperty/composables/useCachedProperties'

export function useCachedPropertyById (queryKey: string, queryValue: string, propertyId: string) {
  if (!propertyId) {
    console.warn(`[usePropertyById] Invalid propertyId: ${propertyId}`)
    return {
      data: null,
      isPending: false,
      isError: true,
      error: new Error('Invalid propertyId provided'),
      property: null,
    }
  }

  const query = useCachedProperties(queryKey, queryValue)

  const property = computed(() => {
    if (!query?.data?.value) return null

    const data = query.data.value

    if (Array.isArray(data)) {
      return data.find(p => p.$id === propertyId)
    }

    if (typeof data === 'object' && data !== null) {
      return data[propertyId] || null
    }

    return null
  })

  return {
    ...query,
    property,
  }
}
