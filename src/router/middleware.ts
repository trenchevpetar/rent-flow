import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

import { useFeatureFlags } from '@/config/feature-flags.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts'
import { router } from '@/router/index.ts'

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  const { isFeatureEnabled } = useFeatureFlags()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/')
  }

  if (to.path === '/' && authStore.isLoggedIn) {
    return next('/dashboard')
  }

  if (to.meta.requiresFeature) {
    const requiredFlag = to.meta.requiresFeature as string
    if (!isFeatureEnabled(requiredFlag)) {
      return next('/feature-not-available')
    }
  }

  next()
})
