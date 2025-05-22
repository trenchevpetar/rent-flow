<template>
  <TheHeader />
  <DefaultLayout>
    <RouterView />
    <pre>
      {{ currentUser }}
    </pre>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TheHeader from '@/shared/components/TheHeader/TheHeader.vue';
import { account } from '@/shared/utils/api.ts';

const currentUser = ref()

const isLoggedIn = async () => {
  try {
    currentUser.value = await account.get()
  } catch (err) {
    console.log(err);
  }
}

isLoggedIn()
</script>
