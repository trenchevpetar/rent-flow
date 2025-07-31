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
    title="Pick color for this category"
    v-model="isColorModalActive"
  >
    <TheSpinner :is-loading="isPending" />
    <TwitterPicker
      triangle="hide"
      width="100%"
      v-model="selectedColor"
      :preset-colors="colors"
    />
    <template #footer>
      <button
        class="btn btn-primary"
        @click="onCategorySave"
      >
        Save
      </button>
    </template>
  </TheModal>

  <TheModal
    title="Pick icon for this category"
    v-model="isIconModalActive"
  >
    <TheSpinner :is-loading="isPending" />
    <CategoryIconPicker @select="onIconSelect" />
    <template #footer>
      <button
        class="btn btn-primary"
        @click="onCategorySave"
      >
        Save
      </button>
    </template>
  </TheModal>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, computed, defineModel } from 'vue'
import { TwitterPicker } from 'vue-color';
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
const colors = computed(() => [
  '#0d0d15',
  '#0b0c12',
  '#090a0f',
  '#8d28a2',
  '#d83e5b',
  '#f5d1da',
  '#64cdd0',
  '#385760',
  '#131216',
  '#66aee4',
  '#354d70',
  '#63c883',
  '#3f725a',
  '#e8b84f',
  '#786331',
  '#dd5d4c',
  '#4f3029'
])


const { property } = useCachedPropertyById('ownerId', userId.value, propertyId.value)

// Category modal state
const isIconModalActive = ref(false)
const isColorModalActive = ref(false)
const selectedColor = defineModel({ default: '#64cdd0', type: String })
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

    isIconModalActive.value = false
  },

  onError: (err) => {
    console.error('Failed to update category:', err)
  }
})

// Handlers
const onAddColor = (category: Category) => {
  currentCategory.value = category
  isColorModalActive.value = true;
}

const onAddIcon = (category: Category) => {
  currentCategory.value = category
  isIconModalActive.value = true
}

const onIconSelect = (name: string) => {
  currentCategory.value = {
    ...(currentCategory.value as Category),
    icon: name
  }
}

const onCategorySave = async () => {
  if (!currentCategory.value?.id) return

  console.log(currentCategory.value);

  updateCategoryMutation.mutate({
    id: currentCategory.value.id,
    data: {
      label: currentCategory.value.label,
      icon: currentCategory.value.icon,
      color: selectedColor.value || currentCategory.value.color,
    },
  })
}
</script>

