<template>
  <div class="space-y-2 bg-base-200 min-h-screen">
    <p class="text-sm">
      Right click to edit added categories
    </p>
    <div
      v-if="propertyCategoriesQuery.isPending.value"
      class="flex items-center space-x-2"
    >
      <span class="loading loading-spinner loading-sm" />
      <span>Loading categories...</span>
    </div>

    <!-- Error state -->
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
      class="join"
    >
      <li
        v-for="category in categories"
        :key="category.id"
        class="join-item"
        @contextmenu.prevent="(e) => openMenu(e, category)"
      >
        <button class="btn btn-soft btn-sm">
          {{ category.label }}
        </button>
      </li>
    </ul>
    <!-- Context menu -->
    <ul
      v-if="menuVisible"
      :style="{ top: menuY + 'px', left: menuX + 'px' }"
      class="menu menu-compact dropdown-content bg-base-100 rounded-box w-52 shadow-lg fixed z-50"
      @click="closeMenu"
    >
      <li>
        <button @click.prevent="handleAction('on-add-color')">
          Add color
        </button>
      </li>
      <li>
        <button @click.prevent="handleAction('on-add-icon')">
          Add icon
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { ref, defineProps, computed, watch } from 'vue'

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts'
import { refetchCategories, resolveCategoryLabels } from '@/features/Property/Categories/services/category.service.ts'
import type { Category } from '@/features/Property/Categories/types/category.type.ts'
import { useToastStore } from '@/shared/stores/useToastStore.ts';

type ActionType = 'on-add-color' | 'on-add-icon'
const emit = defineEmits(['on-add-color', 'on-add-icon'] as const)

const props = defineProps<{ propertyId: string }>()

const toastStore = useToastStore()
const categories = ref<Category[]>()
const authStore = useAuthStore()
const userId = computed(() => authStore.currentUser?.$id || '')

const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const selectedCategory = ref<Category | null>(null)

// Use vue-query to fetch resolved categories by propertyId
const propertyCategoriesQuery = useQuery({
  queryKey: ['property-categories', props.propertyId],
  queryFn: () => refetchCategories(props.propertyId),
  enabled: computed(() => !!props.propertyId),
  staleTime: 60 * 1000, // 1 min stale
  retry: 3
})

watch(
  () => propertyCategoriesQuery.data.value?.categoryIds,
  async (newCategoryIds) => {
    if (newCategoryIds) {
      categories.value = await resolveCategoryLabels(userId.value, newCategoryIds)
    }
  }
)

// Context menu handlers
function openMenu (event: MouseEvent, category: Category) {
  event.preventDefault()
  menuX.value = event.clientX
  menuY.value = event.clientY
  menuVisible.value = true
  selectedCategory.value = category
  document.addEventListener('click', onClickOutside)
}

function closeMenu () {
  menuVisible.value = false
  selectedCategory.value = null
  document.removeEventListener('click', onClickOutside)
}

function onClickOutside () {
  closeMenu()
}

function handleAction (action: ActionType) {
  if (!selectedCategory.value?.isCustom) {
    toastStore.show('This category has default icon', 'info')
    closeMenu()
    return
  }
  emit(action, selectedCategory.value)
  closeMenu()
}
</script>
