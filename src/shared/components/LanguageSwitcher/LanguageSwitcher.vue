<template>
  <button
    class="btn btn-ghost"
    @click="toggleLanguage"
  >
    🌐 {{ locale === 'en-US' ? 'Macedonian' : 'English' }}
  </button>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import type { MessagesSchema } from '@/i18n/messages.ts';

const { locale } = useI18n<[MessagesSchema], 'en-US' | 'mk-MK'>();

const toggleLanguage = () => {
  const newLocale = locale.value === 'en-US' ? 'mk-MK' : 'en-US';
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
}
</script>
