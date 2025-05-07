import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import { createApp } from 'vue'

import '@/style.css'
import App from '@/App.vue'
import { router } from '@/router';
import pinia from '@/store/global.ts';
import '@/router/middleware.ts'

const queryClient = new QueryClient();

createApp(App)
  .use(VueQueryPlugin, { queryClient })
  .use(pinia)
  .use(router)
  .mount('#app')
