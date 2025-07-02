<template>
  <div class="space-y-3">
    <!-- Search bar -->
    <input
      v-model="iconSearch"
      type="text"
      placeholder="Search icons..."
      class="input input-bordered w-full"
    >

    <!-- Icon grid -->
    <div class="grid grid-cols-6 md:grid-cols-8 gap-4 max-h-96 overflow-y-auto p-2">
      <component
        v-for="(icon, name) in filteredIcons"
        :key="name"
        :is="icon"
        class="w-8 h-8 cursor-pointer rounded p-1 transition-colors"
        :class="{
          'text-primary bg-primary/10 ring-2 ring-primary': name === selectedIcon,
          'hover:text-primary hover:bg-base-200': name !== selectedIcon
        }"
        @click="selectIcon(name)"
        :title="name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as HeroIcons from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

const iconSearch = ref('')
const selectedIcon = ref('');

const emit = defineEmits<{
  (e: 'select', iconName: string): void
}>()

const filteredIcons = computed(() => {
  if (!iconSearch.value) return HeroIcons
  const searchLower = iconSearch.value.toLowerCase()
  return Object.fromEntries(
    Object.entries(HeroIcons).filter(([name]) =>
      name.toLowerCase().includes(searchLower)
    )
  )
})

function selectIcon (name: string) {
  selectedIcon.value = name;
  emit('select', name)
}
</script>
