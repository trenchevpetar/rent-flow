<template>
  <fieldset class="fieldset">
    <label class="input w-full">
      <span
        v-if="label"
        class="label"
      >
        {{ label }}
      </span>

      <input
        class="input w-full focus:outline-none focus:ring-0 focus:border-transparent"
        :type="type"
        v-model="model"
      >
    </label>
  </fieldset>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const model = defineModel<string>()
function getCurrentMonth () : string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const localValue = ref(!model.value ? getCurrentMonth() : model.value)

watch(model, (val) => {
  if (val !== localValue.value) {
    localValue.value = val ?? getCurrentMonth()
  }
})

defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'date'
  }
})
</script>
