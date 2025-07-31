<template>
  <div class="space-y-2 bg-base-200 min-h-screen">
    <p class="text-sm">
      Click to edit added categories
    </p>

    <div
      v-if="propertyCategoriesQuery.isPending.value"
      class="flex items-center space-x-2"
    >
      <span class="loading loading-spinner loading-sm" />
      <span>Loading categories...</span>
    </div>

    <div
      v-else-if="propertyCategoriesQuery.isError.value"
      class="alert alert-error"
    >
      <span>Failed to load categories</span>
      <button
        class="btn btn-sm btn-outline"
        @click="propertyCategoriesQuery.refetch()"
      >
        Retry
      </button>
    </div>

    <ul
      v-else
      class="space-y-2"
    >
      <li
        v-for="category in customCategories"
        :key="category.id"
        class="relative"
      >
        <button
          class="btn btn-soft btn-sm"
          :style="`background-color: ${category.color}`"
          @click="toggleMenu(category)"
        >
          <TheIcon :icon-name="category.icon" />
          {{ category.label }}
        </button>

        <ul
          v-if="selectedCategory?.id === category.id"
          class="absolute z-10 mt-1 bg-base-100 rounded-box w-52 shadow-lg menu menu-compact"
        >
          <li>
            <button @click.prevent="onAddColor">
              Add color
            </button>
          </li>
          <li>
            <button @click.prevent="onAddIcon">
              Add icon
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { ref, defineProps, computed, watchEffect } from 'vue'

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts'
import { refetchCategories, resolveCategoryLabels } from '@/features/Property/Categories/services/category.service.ts'
import type { Category } from '@/features/Property/Categories/types/category.type.ts'
import TheIcon from '@/shared/components/TheIcon/TheIcon.vue';
import { useToastStore } from '@/shared/stores/useToastStore.ts'

const emit = defineEmits(['on-add-color', 'on-add-icon'] as const)

const props = defineProps<{ propertyId: string }>()
const toastStore = useToastStore()
const authStore = useAuthStore()
const userId = computed(() => authStore.currentUser?.$id || '')

const categories = ref<Category[]>()
const customCategories = ref<Category[]>()
const selectedCategory = ref<Category | null>(null)

const propertyCategoriesQuery = useQuery({
  queryKey: ['property-categories', props.propertyId],
  queryFn: () => refetchCategories(props.propertyId),
  enabled: computed(() => !!props.propertyId),
})

watchEffect(async () => {
  const ids = propertyCategoriesQuery.data.value?.categoryIds
  if (ids) {
    categories.value = await resolveCategoryLabels(userId.value, ids)
    customCategories.value = categories.value.filter((category) => category.isCustom)
  }
})

function toggleMenu (category: Category) {
  selectedCategory.value = selectedCategory.value?.id === category.id ? null : category
}

function onAddColor () {
  if (!selectedCategory.value) return

  if (!selectedCategory.value.isCustom) {
    toastStore.show('This category has default color', 'info')
    selectedCategory.value = null
    return
  }

  emit('on-add-color', selectedCategory.value)
  selectedCategory.value = null
}

function onAddIcon () {
  if (!selectedCategory.value) return

  if (!selectedCategory.value.isCustom) {
    toastStore.show('This category has default icon', 'info')
    selectedCategory.value = null
    return
  }

  emit('on-add-icon', selectedCategory.value)
  selectedCategory.value = null
}
</script>

