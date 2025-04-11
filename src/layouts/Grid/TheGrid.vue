<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  columns: { type: Number, default: 12 }
})

const gridClass = computed(() => `grid grid-cols-${props.columns} gap-4`)
</script>
