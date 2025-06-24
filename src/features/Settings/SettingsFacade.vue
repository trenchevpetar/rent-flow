<template>
  <h1 class="title text-2xl">
    {{ t('settings.label') }}
  </h1>
  <div class="divider" />
  <AddCategoryToProperty />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import AddCategoryToProperty from '@/features/Settings/Category/AddCategory/components/AddCategoryToProperty.vue';
import type { MessagesSchema } from '@/i18n/messages.ts';

const { t } = useI18n<{ messages: MessagesSchema }>()
</script>