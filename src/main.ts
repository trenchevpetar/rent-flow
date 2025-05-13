import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import { createApp } from 'vue'

import App from '@/App.vue'
import i18n from '@/i18n';
import '@/style.css'
import { router } from '@/router';
import pinia from '@/store/global.ts';
import '@/router/middleware.ts'

const queryClient = new QueryClient();

createApp(App)
  .use(i18n)
  .use(VueQueryPlugin, { queryClient })
  .use(pinia)
  .use(router)
  .mount('#app')
