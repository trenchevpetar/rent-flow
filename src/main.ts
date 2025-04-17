import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import pinia from './store/global.ts';
import { router } from './router';
import './router/middleware.ts'

const queryClient = new QueryClient();

createApp(App)
  .use(VueQueryPlugin, { queryClient })
  .use(pinia)
  .use(router)
  .mount('#app')
