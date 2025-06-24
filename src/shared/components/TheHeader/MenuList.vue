<template>
  <ul class="border-r border-r-indigo-50 pr-2">
    <li>
      <RouterLink
        to="/settings"
        class="btn btn-ghost"
      >
        {{ t('settings.label') }}
      </RouterLink>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import type { MessagesSchema } from '@/i18n/messages.ts';

const { t } = useI18n<{ messages: MessagesSchema }>()
</script>