<template>
  <fieldset class="fieldset">
    <legend
      v-if="label"
      class="fieldset-label"
    >
      {{ label }}
    </legend>
    <select
      v-model="modelValue"
      class="select w-full"
    >
      <option
        disabled
        selected
      >
        {{ defaultValue }}
      </option>
      <option
        v-for="(item, index) in items"
        :key="index"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
  </fieldset>
</template>

<script lang="ts" setup>
type Item = {
  value: string;
  label: string;
}

const modelValue = defineModel<string>({ type: String })
defineProps({
  label: {
    type: String,
    default: ''
  },
  defaultValue: {
    type: String,
    default: 'Pick option'
  },
  items: {
    type: Array<Item>,
    default: () => [{
      value: 'single',
      label: 'Single'
    }]
  }
})
</script>
