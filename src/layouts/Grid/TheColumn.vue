<template>
  <div :class="columnClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: { type: Number, default: 12 }
})

const columnClass = computed(() => `col-span-${props.size}`)
</script>
