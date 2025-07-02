<template>
  <fieldset class="fieldset w-full">
    <legend class="sr-only">
      {{ label }}
    </legend>
    <span class="fieldset-label">{{ label }}</span>

    <input
      v-model="input"
      class="input input-bordered w-full mb-2"
      placeholder="Add custom category and press Enter"
      @keydown.enter.prevent="handleCustomCategory"
      :disabled="isLoading"
    >

    <div class="flex flex-wrap gap-2">
      <button
        v-for="cat in allCategories"
        :key="cat.id"
        class="btn btn-sm transition-all whitespace-nowrap"
        :class="{
          'btn-outline': !isSelected(cat),
          'btn-accent': isSelected(cat),
          'opacity-50 cursor-not-allowed': isLoading
        }"
        @click="handleSelect(cat)"
        :disabled="isLoading"
      >
        <TheIcon :icon-name="cat.icon" />
        {{ cat.label }}
        <XMarkIcon
          v-if="isSelected(cat)"
          class="w-4 h-4 ml-1"
        />
      </button>
    </div>

    <div
      v-if="categoriesQuery.isError.value"
      class="text-error text-sm mt-2"
    >
      Failed to load categories
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, computed, watch } from 'vue'

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts'
import {
  getAllCategories,
  addCategoryToProperty,
  removeCategoryFromProperty,
  refetchCategories
} from '@/features/Property/Categories/services/category.service.ts'
import type { Category } from '@/features/Property/Categories/types/category.type.ts'
import TheIcon from '@/shared/components/TheIcon/TheIcon.vue';

const props = defineProps<{
  label: string
  propertyId: string
  alreadySavedCategoryIds: string[]
}>()

const input = ref('')
const selectedCategoryIds = ref<string[]>([])

const authStore = useAuthStore()
const userId = computed(() => authStore.currentUser?.$id || '')
const queryClient = useQueryClient()

// Query for all categories
const categoriesQuery = useQuery({
  queryKey: ['categories', userId],
  queryFn: () => getAllCategories(userId.value),
  enabled: computed(() => !!userId.value),
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// Query for property categories
const propertyQuery = useQuery({
  queryKey: ['property-categories', props.propertyId],
  queryFn: () => refetchCategories(props.propertyId),
  enabled: computed(() => !!props.propertyId),
  staleTime: 60 * 1000, // 1 minute
})

// Mutation for adding category to property
const addCategoryMutation = useMutation({
  mutationFn: ({ category }: { category: Category }) =>
      addCategoryToProperty(props.propertyId, userId.value, category),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['property-categories', props.propertyId]
    })
    queryClient.invalidateQueries({
      queryKey: ['categories', userId.value]
    })
  },
  onError: (error) => {
    console.error('Error adding category:', error)
  }
})

// Mutation for removing category from property
const removeCategoryMutation = useMutation({
  mutationFn: ({ categoryId }: { categoryId: string }) =>
      removeCategoryFromProperty(props.propertyId, categoryId),
  onSuccess: () => {
    // Invalidate property categories to refetch
    queryClient.invalidateQueries({
      queryKey: ['property-categories', props.propertyId]
    })
  },
  onError: (error) => {
    console.error('Error removing category:', error)
  }
})

// Computed values
const allCategories = computed(() => categoriesQuery.data.value || [])
const isLoading = computed(() =>
  categoriesQuery.isLoading.value ||
  propertyQuery.isLoading.value ||
  addCategoryMutation.isPending.value ||
  removeCategoryMutation.isPending.value
)

// Watch for property category changes
watch(
  () => props.alreadySavedCategoryIds,
  (newVal) => {
    selectedCategoryIds.value = [...(newVal ?? [])]
  },
  { immediate: true }
)

// Also watch the property query result
watch(
  () => propertyQuery.data.value?.categoryIds,
  (newCategoryIds) => {
    if (newCategoryIds) {
      selectedCategoryIds.value = [...newCategoryIds]
    }
  }
)

const isSelected = (cat: Category) => selectedCategoryIds.value.includes(cat.id || '')

async function handleSelect (cat: Category) {
  if (isLoading.value) return

  if (isSelected(cat)) {
    removeCategoryMutation.mutate({ categoryId: cat.id || '' })
  } else {
    addCategoryMutation.mutate({ category: cat })
  }
}

async function handleCustomCategory () {
  const label = input.value.trim()
  if (!label || isLoading.value) return

  const alreadyExists = allCategories.value.some(
      (c) => c.label.toLowerCase() === label.toLowerCase()
  )

  if (alreadyExists) {
    input.value = ''
    return
  }

  const newCat: Category = {
    label,
    isCustom: true
  }

  addCategoryMutation.mutate(
    { category: newCat },
    {
      onSuccess: () => {
        input.value = ''
      }
    }
  )
}
</script>
