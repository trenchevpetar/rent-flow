<template>
  <div class="flex gap-2">
    <input
      v-for="(digit, index) in modelValue"
      :key="index"
      ref="inputs"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="input input-bordered w-12 text-center"
      :value="digit"
      @input="onInput($event, index)"
      @keydown="onKeydown($event, index)"
      @paste="onPaste($event)"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const modelValue = defineModel<string[]>({ default: () => ['', '', '', '', '', ''] });

const inputs = ref<HTMLInputElement[]>([]);

function onInput (e: Event, index: number) {
  const input = e.target as HTMLInputElement;
  const val = input.value.replace(/\D/g, '').charAt(0); // Keep only one digit
  modelValue.value[index] = val;

  if (val && index < modelValue.value.length - 1) {
    nextTick(() => inputs.value[index + 1]?.focus());
  }
}

function onKeydown (e: KeyboardEvent, index: number) {
  if (e.key === 'Backspace' && !modelValue.value[index] && index > 0) {
    modelValue.value[index - 1] = '';
    nextTick(() => inputs.value[index - 1]?.focus());
  } else if (e.key === 'ArrowLeft' && index > 0) {
    inputs.value[index - 1]?.focus();
  } else if (e.key === 'ArrowRight' && index < modelValue.value.length - 1) {
    inputs.value[index + 1]?.focus();
  }
}

function onPaste (e: ClipboardEvent) {
  const pasted = e.clipboardData?.getData('text') || '';
  if (/^\d{6}$/.test(pasted)) {
    modelValue.value = pasted.split('').slice(0, 6);
    nextTick(() => inputs.value[5]?.focus());
    e.preventDefault();
  }
}
</script>
