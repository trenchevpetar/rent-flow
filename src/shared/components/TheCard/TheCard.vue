<template>
  <div
    @click="onSelect"
    class="card bg-base-100 shadow-sm mb-4 border-2 border-white/20"
    :class="{
      'transition-colors duration-200 cursor-pointer hover:border-2 hover:border-white' : canBeSelected
    }"
  >
    <div class="card-body">
      <h2 class="card-title">
        <slot name="title" />
      </h2>
      <slot />
      <div class="card-actions justify-end">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    canBeSelected?: boolean
  }>(),
  {
    canBeSelected: false
  }
)

const emit = defineEmits(['on-select'])

const onSelect = () => emit('on-select')
</script>