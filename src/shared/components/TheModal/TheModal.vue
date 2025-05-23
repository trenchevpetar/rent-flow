<template>
  <dialog
    ref="modalRef"
    class="modal"
    @close="modelValue = false"
  >
    <div class="modal-box">
      <!-- Close Button -->
      <button
        v-if="closable"
        @click="closeModal"
        class="btn btn-sm btn-circle absolute right-2 top-2"
      >
        ✕
      </button>

      <!-- Modal Title -->
      <h3
        v-if="title"
        class="text-xl font-bold"
      >
        {{ title }}
      </h3>

      <!-- Modal Body -->
      <div class="mt-4">
        <slot />
      </div>

      <!-- Footer Slot -->
      <div
        v-if="$slots.footer"
        class="mt-6 flex"
      >
        <slot name="footer" />
      </div>
    </div>

    <!-- Click outside to close -->
    <form
      v-if="closable"
      method="dialog"
      class="modal-backdrop"
    >
      <button @click="closeModal">
        Close
      </button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineProps({
  title: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const modalRef = ref<HTMLDialogElement | null>(null);

const modelValue = defineModel({ type: Boolean, default: false })
watch(modelValue, (newVal) => {
  if (newVal) {
    modalRef.value?.showModal()
  } else {
    closeModal()
  }
})

const closeModal = () => {
  modalRef.value?.close()
  modelValue.value = false
}
</script>
