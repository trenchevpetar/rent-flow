import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

import { useFeatureFlags } from '@/config/feature-flags.ts';
import { router } from '@/router/index.ts'
import { account } from '@/shared/utils/api.ts';

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const { isFeatureEnabled } = useFeatureFlags()

  if (to.meta.requiresAuth) {
    try {
      await account.get();

      return next()
    } catch {
      return next('/')
    }
  }

  if (to.path === '/') {
    try {
      await account.get();

      return next('/dashboard')
    } catch {
      return next()
    }
  }

  if (to.meta.requiresFeature) {
    const requiredFlag = to.meta.requiresFeature as string
    if (!isFeatureEnabled(requiredFlag)) {
      return next('/feature-not-available')
    }
  }

  next()
})
