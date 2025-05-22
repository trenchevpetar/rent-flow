<template>
  <TheHeader />
  <DefaultLayout>
    <RouterView />
    <pre>
      {{ isLoggedIn() }}
    </pre>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TheHeader from '@/shared/components/TheHeader/TheHeader.vue';
import { account } from '@/shared/utils/api.ts';

const isLoggedIn = async () => {
  return await account.get()
}
</script>
