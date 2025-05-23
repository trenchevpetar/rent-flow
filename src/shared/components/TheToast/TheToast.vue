<!-- components/AppToast.vue -->
<template>
  <div class="fixed bottom-4 right-4 space-y-2 w-80 z-[9999]">
    <TransitionGroup
      name="toast"
      tag="div"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="`alert alert-${toast.type}`"
        class="shadow-lg flex justify-between items-center mb-4"
        @click="remove(toast.id)"
      >
        <span>{{ toast.message }}</span>
        <button
          class="btn btn-sm btn-circle ml-2"
          @click.stop="remove(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/shared/stores/useToastStore.ts';
const { toasts, remove } = useToastStore();
</script>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
</style>
