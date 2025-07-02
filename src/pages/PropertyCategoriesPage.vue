<template>
  <h1 class="title text-2xl">
    {{ property?.name }}
  </h1>

  <div class="divider divider-warning" />

  <AddCategoryToPropertyManager
    v-if="property"
    label="Categories"
    :property-id="property.$id || ''"
    :already-saved-category-ids="property.categoryIds || []"
  />

  <div class="divider divider-warning" />

  <CategoriesWithContextMenu
    v-if="property"
    :property-id="property.$id"
    @on-add-color="onAddColor"
    @on-add-icon="onAddIcon"
  />

  <TheModal
    title="Pick icon for this category"
    v-model="isColorModalActive"
  >
    <TheSpinner :is-loading="isPending" />
    <CategoryIconPicker @select="onIconSelect" />
    <template #footer>
      <button
        class="btn btn-primary"
        @click="onIconSave"
      >
        Save
      </button>
    </template>
  </TheModal>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts'
import { useCachedPropertyById } from '@/features/Property/AddProperty/composables/useCachedPropertyById.ts'
import AddCategoryToPropertyManager from '@/features/Property/Categories/components/AddCategoryToPropertyManager.vue'
import CategoriesWithContextMenu from '@/features/Property/Categories/components/CategoriesWithContextMenu.vue'
import CategoryIconPicker from '@/features/Property/Categories/components/CategoryIconPicker.vue'
import { updateCategory } from '@/features/Property/Categories/services/category.service.ts'
import type { Category } from '@/features/Property/Categories/types/category.type.ts'
import TheModal from '@/shared/components/TheModal/TheModal.vue'
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

// Route and Auth
const route = useRoute()
const authStore = useAuthStore()
const userId = computed(() => authStore.currentUser?.$id ?? '')
const propertyId = computed(() => route.params.id as string)
const isPending = computed(() => updateCategoryMutation.isPending.value)

const { property } = useCachedPropertyById('ownerId', userId.value, propertyId.value)

// Category modal state
const isColorModalActive = ref(false)
const currentCategory = ref<Category>({
  id: '',
  label: '',
  icon: '',
  color: '',
  isCustom: false
})

// TanStack Query
const queryClient = useQueryClient()

const updateCategoryMutation = useMutation({
  mutationFn: ({ id, data }: {
    id: string
    data: { label?: string; icon?: string; color?: string }
  }) => updateCategory(id, data),

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['categories', userId.value], })

    queryClient.invalidateQueries({ queryKey: ['property-categories', propertyId.value], })

    isColorModalActive.value = false
  },

  onError: (err) => {
    console.error('Failed to update category:', err)
  }
})

// Handlers
const onAddColor = () => {}

const onAddIcon = (category: Category) => {
  currentCategory.value = category
  isColorModalActive.value = true
}

const onIconSelect = (name: string) => {
  currentCategory.value = {
    ...(currentCategory.value as Category),
    icon: name
  }
}

const onIconSave = async () => {
  if (!currentCategory.value?.id) return

  updateCategoryMutation.mutate({
    id: currentCategory.value.id,
    data: {
      label: currentCategory.value.label,
      icon: currentCategory.value.icon,
      color: currentCategory.value.color || '',
    },
  })
}
</script>

