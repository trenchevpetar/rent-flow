<template>
  <form
    @submit.prevent="onRegister"
    class="flex justify-center align-center h-screen items-center"
  >
    <fieldset class="fieldset w-md border border-base-300 p-4 rounded-box">
      <h1 class="title text-2xl">
        {{ t('register.label') }}
      </h1>
      <InputField
        v-model="formValues.name"
        :label="t('register.name')"
        :placeholder="t('placeholders.register.name')"
      />

      <InputField
        v-model="formValues.email"
        :label="t('register.email')"
        :placeholder="t('placeholders.register.email')"
      />

      <InputField
        v-model="formValues.password"
        :label="t('register.password')"
        type="password"
        :placeholder="t('placeholders.register.password')"
      />

      <InputField
        v-model="formValues.phone"
        :label="t('register.phone')"
        :placeholder="t('placeholders.register.phone')"
      />

      <div class="flex w-full justify-end gap-2 mt-2">
        <button
          type="submit"
          class="btn btn-primary"
        >
          {{ t('register.label') }}
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { register } from '@/features/Register/services/register.service.ts';
import type { User } from '@/features/Register/types/user.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import InputField from '@/shared/components/InputField/InputField.vue';

const { t } = useI18n<{ messages: MessagesSchema }>()
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
