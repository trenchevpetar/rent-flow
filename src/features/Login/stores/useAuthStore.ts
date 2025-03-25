import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);

  function setLoggedIn (value) {
    isLoggedIn.value = value
  }

  return {
    isLoggedIn,
    setLoggedIn
  }
}, {
  persist: {
    key: 'rent-flow-auth'
  }
})
