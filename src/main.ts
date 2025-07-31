import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createApp } from 'vue'

import App from '@/App.vue'
import '@/style.css'
import 'vue-color/style.css'
import { CONFIG } from '@/config/config.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import i18n from '@/i18n'
import { router } from '@/router'
import { databases } from '@/shared/utils/api.ts';
import pinia from '@/store/global.ts'

const queryClient = new QueryClient()

// Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)
;(async () => {
  await queryClient.prefetchQuery({
    queryKey: ['featureFlags'],
    queryFn: async () => {
      const response = await databases.listDocuments(CONFIG.DATABASE_ID, CONFIG.COLLECTIONS.FEATURE_FLAGS)
      return response.documents
    }
  })

  const app = createApp(App)

  app
    .use(i18n)
    .use(VueQueryPlugin, { queryClient })
    .use(pinia)
    .use(router)

  const authStore = useAuthStore();
  await authStore.fetchUser()

  await router.isReady()
  app.mount('#app')
})()
