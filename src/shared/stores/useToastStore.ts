// stores/toastStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  timeoutId?: ReturnType<typeof setTimeout>;
  resolve?: () => void;
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);
  let nextId = 1;

  function show (message: string, type: ToastType = 'info', duration = 3000): Promise<void> {
    return new Promise((resolve) => {
      const id = nextId++;
      const toast: Toast = { id, message, type, resolve };

      toast.timeoutId = setTimeout(() => {
        remove(id);
      }, duration);

      toasts.value.push(toast);
    });
  }

  function remove (id: number) {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      const toast = toasts.value[index];
      clearTimeout(toast.timeoutId);
      toast.resolve?.(); // resolves Promise only if user awaited
      toasts.value.splice(index, 1);
    }
  }

  return {
    toasts,
    show,
    remove,
  };
});
