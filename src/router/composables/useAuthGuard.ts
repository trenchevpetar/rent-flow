import type { NavigationGuard } from 'vue-router';

import { useFeatureFlags } from '@/config/feature-flags.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';

export const useAuthGuard: NavigationGuard = async (to, _, next) => {
  const authStore = useAuthStore();
  const { isFeatureEnabled } = useFeatureFlags()

  if (!authStore.isInitialized) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/');
  }

  if (to.path === '/' && authStore.isLoggedIn) {
    return next('/dashboard');
  }

  if (to.meta.requiresFeature) {
    const requiredFlag = to.meta.requiresFeature as string
    if (!isFeatureEnabled(requiredFlag)) {
      return next('/feature-not-available')
    }
  }

  next();
}