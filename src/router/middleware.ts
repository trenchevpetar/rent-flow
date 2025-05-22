import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

import { useFeatureFlags } from '@/config/feature-flags.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { router } from '@/router/index.ts'
import { account } from '@/shared/utils/api.ts';

let accountChecked = false

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  const { isFeatureEnabled } = useFeatureFlags()

  console.log('start middleware')

  if (!accountChecked && !authStore.currentUser) {
    try {
      const user = await account.get()
      authStore.setCurrentUser(user)
    } catch {
      authStore.setCurrentUser(null)
    } finally {
      accountChecked = true
    }
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    console.log('requires auth')
    return next('/')
  }

  if (to.path === '/' && authStore.isLoggedIn) {
    console.log('already logged in')
    return next('/dashboard')
  }

  if (to.meta.requiresFeature) {
    console.log('feature flags')
    const requiredFlag = to.meta.requiresFeature as string
    if (!isFeatureEnabled(requiredFlag)) {
      return next('/feature-not-available')
    }
  }

  next()
})
