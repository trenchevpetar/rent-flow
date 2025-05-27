<template>
  <button
    class="btn btn-ghost"
    @click="toggleLanguage"
  >
    🌐 {{ text }}
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { MessagesSchema } from '@/i18n/messages.ts';
import { useBreakpoints } from '@/shared/composables/useBreakpoints.ts';

const { isMobile } = useBreakpoints()
const { t, locale } = useI18n<[MessagesSchema], 'en-US' | 'mk-MK'>();

const toggleLanguage = () => {
  const newLocale = locale.value === 'en-US' ? 'mk-MK' : 'en-US';
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
}

const text = computed(() => {
  if (locale.value === 'en-US') {
    if (isMobile) {
      return t('language.mkAbbr')
    }
    return t('language.mk')
  }

  if (isMobile) {
    return t('language.enAbbr')
  }
  return t('language.en')
})
</script>
