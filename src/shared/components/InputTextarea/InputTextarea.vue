<template>
  <fieldset class="fieldset">
    <legend class="fieldset-label">
      {{ label }}
    </legend>
    <textarea
      v-model="modelValue"
      class="textarea h-24 w-full"
      :placeholder="placeholder"
    />
    <div class="fieldset-label">
      {{ optionalText }}
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
const modelValue = defineModel<string>({ type: String, default: '' })

defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  optionalText: {
    type: String,
    default: ''
  }
})
</script>
