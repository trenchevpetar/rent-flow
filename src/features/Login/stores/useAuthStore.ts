import type { Models } from 'appwrite';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { account } from '@/shared/utils/api.ts';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<Models.User<Models.Preferences> | null>(null);
  const isInitialized = ref(false);

  const isLoggedIn = computed(() => !!currentUser.value);
  
  async function fetchUser () {
    try {
      currentUser.value = await account.get();
    } catch {
      currentUser.value = null;
    } finally {
      isInitialized.value = true;
    }
  }

  function setCurrentUser (user: Models.User<Models.Preferences> | null) {
    currentUser.value = user;
    isInitialized.value = true;
  }

  async function login (email: string, password: string) {
    try {
      await account.createEmailPasswordSession(email, password);
      currentUser.value = await account.get();
      isInitialized.value = true;
    } catch (err) {
      currentUser.value = null;
      isInitialized.value = true;
      throw err;
    }
  }

  async function logout () {
    await account.deleteSession('current');
    currentUser.value = null;
    isInitialized.value = true;
  }

  return {
    currentUser,
    isLoggedIn,
    isInitialized,
    fetchUser,
    setCurrentUser,
    login,
    logout
  }
}, {
  persist: {
    key: 'rent-flow-auth'
  }
})
