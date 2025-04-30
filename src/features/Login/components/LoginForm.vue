<template>
  <form
    @submit.prevent="onLogin"
    class="flex justify-center align-center h-screen items-center"
  >
    <fieldset class="fieldset w-md border border-base-300 p-4 rounded-box">
      <h1 class="title text-2xl">
        Login
      </h1>
      <InputField
        v-model="formValues.email"
        label="Email"
        placeholder="Email"
      />

      <InputField
        v-model="formValues.password"
        label="Password"
        type="password"
        placeholder="Password"
      />

      <div class="flex w-full justify-end gap-2 mt-2">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Login
        </button>
        <RouterLink
          to="/register"
          class="btn btn-soft"
        >
          Register
        </RouterLink>
      </div>
    </fieldset>
  </form>
  <TheSpinner :is-loading="isLoading" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import InputField from '../../../shared/components/InputField/InputField.vue';

import { login } from '../services/auth.service.ts';

import type { Form } from '../types/form.ts';

import { useAuthStore } from '../stores/useAuthStore.ts';
import { useMutation } from '@tanstack/vue-query';
import TheSpinner from '../../../shared/components/TheSpinner/TheSpinner.vue';

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
