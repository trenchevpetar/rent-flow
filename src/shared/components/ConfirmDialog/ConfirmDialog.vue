<template>
  <dialog
    ref="dialogRef"
    class="modal"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        {{ title }}
      </h3>
      <p class="py-4">
        {{ message }}
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button
            class="btn"
            :disabled="loading"
            @click="handleCancel"
          >
            Cancel
          </button>
        </form>
        <button
          class="btn btn-error"
          :disabled="loading"
          @click="handleConfirm"
        >
          <span
            v-if="loading"
            class="loading loading-spinner"
          />
          <span v-else>Confirm</span>
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'confirm', resolve: (success: boolean) => void): void
  (e: 'cancel'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const loading = ref(false)

const open = () => {
  loading.value = false
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const handleConfirm = () => {
  loading.value = true
  emit('confirm', (success) => {
    loading.value = false
    if (success) {
      close()
    }
  })
}

defineExpose({ open })
</script>
