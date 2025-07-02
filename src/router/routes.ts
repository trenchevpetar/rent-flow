import type { RouteLocationNormalized } from 'vue-router';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import LoginPage from '@/pages/LoginPage.vue';
import PinGuardPage from '@/pages/PinGuardPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import { usePinStore } from '@/shared/stores/usePinStore.ts';

export const routes = [
  { path: '/', component: LoginPage },
  {
    path: '/register',
    component: RegisterPage,
    meta: {
      requiresFeature: 'register'
    }
  },
  {
    path: '/dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/gate',
    component: PinGuardPage,
  },
  {
    path: '/property-details/:id',
    component: () => import('@/pages/PropertyDetailsPage.vue'),
    beforeEnter: async (to: RouteLocationNormalized) => {
      const authStore = useAuthStore();
      const pinStore = usePinStore();
      const id = to.params.id as string;

      if (!authStore.currentUser) {
        await authStore.fetchUser();
      }

      if (authStore.isLoggedIn) return true;
      if (pinStore.isVerified(id)) return true;

      return {
        path: '/gate',
        query: { id },
      };
    }
  },
  {
    path: '/property-categories/:id',
    component: () => import('@/pages/PropertyCategoriesPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/feature-not-available',
    component: () => import('@/pages/FeatureNotAvailablePage.vue')
  }
]
