<template>
  <TheHeader />
  <DefaultLayout>
    <RouterView />
    <TheToast />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TheHeader from '@/shared/components/TheHeader/TheHeader.vue';
import TheToast from '@/shared/components/TheToast/TheToast.vue';
</script>
