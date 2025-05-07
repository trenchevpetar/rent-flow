import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { router } from '@/router/index.ts';

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/')
  } else if (to.path === '/' && authStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next();
  }
})

