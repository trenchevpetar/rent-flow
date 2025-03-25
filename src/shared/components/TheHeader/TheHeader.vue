<template>
  <div class="navbar bg-base-100 shadow-sm sticky top-0 z-50">
    <div class="flex-1">
      <RouterLink
        to="/"
        class="btn btn-ghost text-xl"
      >
        Rent Flow
      </RouterLink>
    </div>
    <button
      v-if="authStore.isLoggedIn"
      @click="onLogout"
      class="btn btn-warning"
    >
      Logout
    </button>
  </div>
  <TheSpinner :is-loading="isLoading" />
</template>

<script lang="ts" setup>
import { logout } from '../../../features/Login/services/auth.service.ts';
import TheSpinner from '../TheSpinner/TheSpinner.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../features/Login/stores/useAuthStore.ts';

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)

const onLogout = async () => {
  isLoading.value = true;
  await logout()
  authStore.setLoggedIn(false);
  await router.push('/')
  isLoading.value = false;
}
</script>
