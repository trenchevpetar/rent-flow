<template>
  <div
    ref="fabRef"
    class="fixed bottom-6 right-6 z-50 flex flex-col items-end"
  >
    <TransitionGroup
      name="fab"
      tag="div"
      class="flex flex-col items-end gap-3 mb-3"
    >
      <template v-if="isOpen">
        <button
          v-for="(action, index) in actions"
          :key="action.name"
          @click="emit(action.name)"
          class="btn btn-md bg-secondary text-white shadow-lg flex items-center gap-2 pr-4 pl-3 rounded-full"
          :style="{ transitionDelay: `${index * 50}ms` }"
        >
          <slot :name="action.name" />
        </button>
      </template>
    </TransitionGroup>

    <button
      class="btn btn-primary btn-circle text-white shadow-xl"
      @click.stop="toggle"
    >
      <slot
        name="toggle"
        :open="isOpen"
      >
        <PlusIcon
          v-if="!isOpen"
          class="h-6 w-6"
        />
        <XMarkIcon
          v-else
          class="h-6 w-6"
        />
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import PlusIcon from '@/assets/icons/PlusIcon.vue';
import XMarkIcon from '@/assets/icons/XMarkIcon.vue';

const emit = defineEmits<{
  (name: string): void
}>()

defineProps<{
  actions: { name: string }[]
}>()

const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)

// Click-outside detection
const fabRef = ref<HTMLElement | null>(null)

function handleClickOutside (event: MouseEvent) {
  if (isOpen.value && fabRef.value && !fabRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fab-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fab-enter-active {
  transition: all 0.3s ease;
}
.fab-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fab-leave-active {
  transition: all 0.2s ease;
}
</style>
