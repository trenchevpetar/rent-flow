<template>
  <label
    :for="computedID"
    class="fieldset-label"
  >
    {{ label }}
  </label>
  <input
    v-model="model"
    :id="computedID"
    :type="type"
    :placeholder="placeholder"
    class="input w-full"
  >
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const model = defineModel({ type: String, default: '' })

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const computedID = computed(() => {
  return props.id || `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
})
</script>
