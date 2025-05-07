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
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { logout } from '@/features/Login/services/auth.service.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';



const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)

const logoutMutation = useMutation({
  mutationFn: () => logout(),
  onSuccess: () => {
    logout()
    authStore.setLoggedIn(false);
    router.push('/')
  }
})

const onLogout = async () => {
  logoutMutation.mutate()
}
</script>
