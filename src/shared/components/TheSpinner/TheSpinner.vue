<template>
  <div
    v-if="isLoading"
    class="absolute inset-0 flex bg-base-300 bg-opacity-50 justify-center items-center z-50"
  >
    <span
      v-if="isLoading"
      class="loading loading-dots"
      :class="`loading-${size}`"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md'
  }
})
</script>
