<template>
  <div :class="columnClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size?: number
  responsive?: Partial<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
}>()

const getColSpanClass = (prefix: string | null, size: number) =>
  `${prefix ? `${prefix}:` : ''}col-span-${Math.min(Math.max(size, 1), 12)}`

const columnClasses = computed(() => {
  const classes: string[] = []

  if (props.size) {
    classes.push(getColSpanClass(null, props.size))
  }

  if (props.responsive) {
    for (const [bp, val] of Object.entries(props.responsive)) {
      classes.push(getColSpanClass(bp, val!))
    }
  }

  return classes
})
</script>
