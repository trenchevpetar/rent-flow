<template>
  <fieldset class="fieldset">
    <legend
      v-if="label"
      class="fieldset-label"
    >
      {{ label }}
    </legend>

    <input
      v-model="modelValue"
      type="date"
      class="input w-full"
    >
  </fieldset>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Date | string>(
  { type: [Date, String], default: new Date().toISOString() }
)

defineProps({
  label: {
    type: String,
    default: ''
  }
})
</script>
