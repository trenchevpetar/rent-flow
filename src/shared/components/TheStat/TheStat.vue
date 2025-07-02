<template>
  <div class="stats w-full">
    <div class="stat">
      <div
        v-if="!isMobile"
        class="stat-figure text-secondary"
      >
        <div class="w-16">
          <slot name="image" />
        </div>
      </div>
      <div class="stat-title text-accent">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="stat-value">
        {{ formattedValue }}
      </div>
      <div class="stat-desc mb-2 text-accent">
        <slot name="description" />
      </div>
      <div
        v-if="$slots.actions"
        class="stat-actions"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useBreakpoints } from '@/shared/composables/useBreakpoints.ts';
import { useFormatAmount } from '@/shared/composables/useFormatAmount.ts';

const { isMobile } = useBreakpoints()
const { format } = useFormatAmount()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})
const formattedValue = computed(() => format(props.value as number))
</script>
