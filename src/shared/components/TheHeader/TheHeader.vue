<template>
  <div class="navbar bg-base-100 shadow-sm sticky top-0 z-50 gap-2">
    <div class="flex-1">
      <RouterLink
        to="/"
        class="btn btn-ghost text-xl"
      >
        Rent Flow
      </RouterLink>
    </div>
    <!--    <MenuList v-if="authStore.isLoggedIn" />-->
    <LanguageSwitcher />
    <button
      v-if="authStore.isLoggedIn"
      @click="onLogout"
      class="btn btn-warning"
    >
      {{ t('logout') }}
    </button>
  </div>
  <TheSpinner :is-loading="isLoading" />
</template>

<script lang="ts" setup>
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher/LanguageSwitcher.vue';
// import MenuList from '@/shared/components/TheHeader/MenuList.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const { t } = useI18n<{ messages: MessagesSchema }>()

const logoutMutation = useMutation({
  mutationFn: async () => {
    isLoading.value = true;
    await authStore.logout();
  },
  onSuccess: async () => {
    isLoading.value = false;
    await router.push('/')
  },
  onError: () => {
    isLoading.value = false;
  }
})

const onLogout = async () => {
  logoutMutation.mutate()
}
</script>
