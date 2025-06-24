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
        class="btn btn-sm transition-all"
        :class="{
          'btn-outline': !isSelected(cat),
          'btn-accent': isSelected(cat),
          'opacity-50 cursor-not-allowed': isLoading
        }"
        @click="handleSelect(cat)"
        :disabled="isLoading"
      >
        {{ cat.label }}
        <XMarkIcon
          v-if="isSelected(cat)"
          class="w-4 h-4 ml-1"
        />
      </button>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { ref, computed, onMounted, watch } from 'vue'

import { CONFIG } from '@/config/config.ts'
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts'
import {
  getAllCategories,
  addCategoryToProperty,
  removeCategoryFromProperty,
} from '@/features/Settings/Category/AddCategory/services/category.service.ts'
import type { Category } from '@/features/Settings/Category/AddCategory/types/category.type.ts'
import { databases } from '@/shared/utils/api.ts'

const props = defineProps<{
  label: string
  propertyId: string
  alreadySavedCategoryIds: string[]
}>()

const input = ref('')
const allCategories = ref<Category[]>([])
const selectedCategoryIds = ref<string[]>([])
const isLoading = ref(false)

const authStore = useAuthStore()
const userId = computed(() => authStore.currentUser?.$id || '')

onMounted(async () => {
  isLoading.value = true
  try {
    allCategories.value = await getAllCategories(userId.value)
  } finally {
    isLoading.value = false
  }
})

watch(
  () => props.alreadySavedCategoryIds,
  (newVal) => {
    selectedCategoryIds.value = [...(newVal ?? [])]
  },
  { immediate: true }
)

const isSelected = (cat: Category) => selectedCategoryIds.value.includes(cat.id || '')

async function handleSelect (cat: Category) {
  if (isLoading.value) return
  isLoading.value = true

  try {
    if (isSelected(cat)) {
      await removeCategoryFromProperty(props.propertyId, cat.id || '')
    } else {
      await addCategoryToProperty(props.propertyId, userId.value, cat)
    }

    await refreshSelectedCategories()
  } catch (err) {
    console.error('Error handling category change:', err)
  } finally {
    isLoading.value = false
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

  const newCat = {
    label,
    isCustom: true
  }

  isLoading.value = true
  try {
    const createdCategory = await addCategoryToProperty(props.propertyId, userId.value, newCat)
    allCategories.value.push(createdCategory)

    await refreshSelectedCategories()
  } catch (err) {
    console.error('Error adding custom category:', err)
  } finally {
    input.value = ''
    isLoading.value = false
  }
}

async function refreshSelectedCategories () {
  try {
    const property = await databases.getDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PROPERTIES,
        props.propertyId
    )
    selectedCategoryIds.value = property.categoryIds || []
  } catch (err) {
    console.error('Error refreshing category IDs:', err)
  }
}
</script>
