// stores/pin.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePinStore = defineStore('pin', () => {
  const verified = ref(false);

  const setVerified = () => {
    verified.value = true;
  };

  return { verified, setVerified };
}, {
  persist: {
    key: 'rent-flow-pin'
  }
});
