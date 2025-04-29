import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Models } from 'appwrite';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const currentUser = ref<Models.User<Models.Preferences> | null>(null);

  function setLoggedIn (value: boolean) {
    isLoggedIn.value = value
  }

  function setCurrentUser (user: Models.User<Models.Preferences> | null) {
    currentUser.value = user;
  }

  return {
    isLoggedIn,
    currentUser,
    setLoggedIn,
    setCurrentUser
  }
}, {
  persist: {
    key: 'rent-flow-auth'
  }
})
