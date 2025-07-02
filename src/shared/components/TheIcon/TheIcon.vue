<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    class="w-5 h-5"
  />
</template>

<script setup lang="ts">
import * as HeroIcons from '@heroicons/vue/24/solid'
import { computed } from 'vue'

const props = defineProps<{ iconName?: string }>()

const iconComponent = computed(() => {
  return props.iconName && props.iconName in HeroIcons
      ? HeroIcons[props.iconName as keyof typeof HeroIcons]
      : null
})
</script>
