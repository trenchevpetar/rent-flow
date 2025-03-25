<template>
  <TheHeader />
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup lang="ts">
import TheHeader from './shared/components/TheHeader/TheHeader.vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
</script>
