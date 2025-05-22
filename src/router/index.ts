import { createWebHistory, createRouter } from 'vue-router';

import { useAuthGuard } from '@/router/composables/useAuthGuard.ts';
import { routes } from '@/router/routes.ts';

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(useAuthGuard)

export { router }
