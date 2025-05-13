import { createI18n } from 'vue-i18n';

import type { MessagesSchema } from '@/i18n/messages.ts';
import enUS from '@/locales/en-US.ts';
import mkMK from '@/locales/mk-MK.ts';

const i18n = createI18n<[MessagesSchema], 'en-US' | 'mk-MK'>({
  legacy: false,
  locale: localStorage.getItem('locale') as 'en-US' | 'mk-MK' || 'mk-MK',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'mk-MK': mkMK
  }
})

export default i18n;
