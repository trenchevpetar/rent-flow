import { ref } from 'vue'

import { resolveCategoriesByIds, refetchCategories } from '@/features/Property/Categories/services/category.service'
import type { Category } from '@/features/Property/Categories/types/category.type.ts';

export function useResolvedCategories (propertyId: string) {
  const allCategories = ref()
  const resolvedCategories = ref()
  const loading = ref(false)

  const resolve = async () => {
    loading.value = true
    allCategories.value = await refetchCategories(propertyId)
    resolvedCategories.value = await resolveCategoriesByIds(allCategories.value.categoryIds)
    loading.value = false
  }

  const getCategoryObject = (id: string) => {
    return resolvedCategories.value?.find((c: Category) => c.id === id) ?? {
      id: 'default',
      label: 'Default',
      icon: 'DocumentIcon'
    }
  }

  return {
    allCategories,
    resolvedCategories,
    loading,
    getCategoryObject,
    resolve
  }
}
