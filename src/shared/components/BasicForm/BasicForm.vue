<template>
  <form
    @submit.prevent="onSubmit"
    class="flex justify-center align-center items-center"
  >
    <fieldset class="fieldset w-full">
      <slot />

      <div class="flex w-full justify-end gap-2 mt-2">
        <slot name="actions">
          <button
            type="submit"
            class="btn btn-primary"
          >
            {{ submitLabel }}
          </button>

          <button
            type="reset"
            class="btn btn-soft"
            @click="onCancel"
          >
            {{ cancelLabel }}
          </button>
        </slot>
      </div>
    </fieldset>
  </form>
</template>
<script setup lang="ts">
const emit = defineEmits(['on-submit', 'on-cancel'])

const onSubmit = () => emit('on-submit')
const onCancel = () => emit('on-cancel')

defineProps<{
  submitLabel: string,
  cancelLabel: string
}>()
</script>
