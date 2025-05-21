<template>
  <form
    @submit.prevent="onLogin"
    class="flex justify-center align-center h-screen items-center"
  >
    <fieldset class="fieldset w-md border border-base-300 p-4 rounded-box">
      <h1 class="title text-2xl">
        {{ t('login.label') }}
      </h1>
      <InputField
        v-model="formValues.email"
        :label="t('login.email')"
        :placeholder="t('placeholders.login.email')"
      />

      <InputField
        v-model="formValues.password"
        :label="t('login.password')"
        type="password"
        :placeholder="t('placeholders.login.password')"
      />

      <div class="flex w-full justify-end gap-2 mt-2">
        <button
          type="submit"
          class="btn btn-primary"
        >
          {{ t('login.label') }}
        </button>
        <RouterLink
          v-if="isRegisterEnabled"
          to="/register"
          class="btn btn-soft"
        >
          {{ t('register.label') }}
        </RouterLink>
      </div>
    </fieldset>
  </form>
  <TheSpinner :is-loading="isLoading" />
</template>

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useFeatureFlags } from '@/config/feature-flags.ts';
import { login } from '@/features/Login/services/auth.service.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { Form } from '@/features/Login/types/form.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import InputField from '@/shared/components/InputField/InputField.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const { isFeatureEnabled } = useFeatureFlags()
const isRegisterEnabled = isFeatureEnabled('register')
const { t } = useI18n<{ messages: MessagesSchema }>()
const authStore = useAuthStore()
const router = useRouter()
const formValues = ref<Form>({
  email: '',
  password: ''
})
const isLoading = ref(false)

const loginMutation = useMutation({
  mutationFn: (data: { email: string; password: string }) => login(data.email, data.password),
  onMutate: () => {
    isLoading.value = true;
  },
  onSuccess: (session) => {
    authStore.setLoggedIn(true);
    router.push('/dashboard');
    isLoading.value = false;
    console.log('Logged in!', session)
  },
  onError: (error) => {
    authStore.setLoggedIn(false);
    router.push('/');
    isLoading.value = false;
    console.error('Login failed:', error)
  }
})

const onLogin = async () => {
  loginMutation.mutate({
    ...formValues.value
  })
}
</script>
