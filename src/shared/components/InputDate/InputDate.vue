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
        v-model="localValue"
        @input="onInput"
      >
    </label>
  </fieldset>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const model = defineModel<string | Date>()

function getCurrentMonth (): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function toMonthString (input: string | Date | undefined): string {
  if (!input) return getCurrentMonth()
  const date = typeof input === 'string' ? new Date(input) : input
  if (isNaN(date.getTime())) return getCurrentMonth()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthToISO (month: string): string {
  return `${month}-01T00:00:00.000Z`
}

const localValue = ref(toMonthString(model.value))

watch(model, (val) => {
  const formatted = toMonthString(val)
  if (formatted !== localValue.value) {
    localValue.value = formatted
  }
})

function onInput () {
  model.value = monthToISO(localValue.value)
}

defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'month'
  }
})
</script>
