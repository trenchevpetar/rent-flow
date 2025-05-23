import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePinStore = defineStore('pin', () => {
  const verifiedProductIds = ref<string[]>([]);

  function isVerified (id: string) {
    return verifiedProductIds.value.includes(id);
  }

  function markVerified (id: string) {
    if (!verifiedProductIds.value.includes(id)) {
      verifiedProductIds.value.push(id);
    }
  }

  return {
    verifiedProductIds,
    isVerified,
    markVerified,
  };
}, {
  persist: {
    key: 'rent-flow-pin'
  }
});
