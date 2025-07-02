<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    :class="[size ? `size-${size}` : 'w-5 h-5']"
  />
</template>

<script setup lang="ts">
import * as HeroIcons from '@heroicons/vue/24/solid'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    iconName?: string,
    size?: string
  }>(),
  {
    iconName: '',
    size: ''
  }
)

const iconComponent = computed(() => {
  return props.iconName && props.iconName in HeroIcons
      ? HeroIcons[props.iconName as keyof typeof HeroIcons]
      : null
})
</script>
