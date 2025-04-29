<template>
  <form
    @submit.prevent="onRegister"
    class="flex justify-center align-center h-screen items-center"
  >
    <fieldset class="fieldset w-md border border-base-300 p-4 rounded-box">
      <h1 class="title text-2xl">
        Register
      </h1>
      <InputField
        v-model="formValues.name"
        label="Name"
        placeholder="Enter your name"
      />

      <InputField
        v-model="formValues.email"
        label="Email"
        placeholder="Enter your email"
      />

      <InputField
        v-model="formValues.password"
        label="Password"
        type="password"
        placeholder="Password"
      />

      <InputField
        v-model="formValues.phone"
        label="Phone"
        placeholder="Enter your phone number"
      />

      <div class="flex w-full justify-end gap-2 mt-2">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Submit
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import InputField from '../../../shared/components/InputField/InputField.vue';

import { register } from '../services/register.service.ts';

import type { User } from '../types/user.ts';

const formValues = ref<User>({
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'landlord'
})

const onRegister = async () => {
  const { email, password, name, phone } = formValues.value;
  await register(email, password, name, phone as string);
}
</script>
