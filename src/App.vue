<template>
  <TheHeader />
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TheHeader from '@/shared/components/TheHeader/TheHeader.vue';
</script>
