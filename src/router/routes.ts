import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';

export const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  {
    path: '/dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/property-details/:id',
    component: () => import('@/pages/PropertyDetailsPage.vue'),
  }
]
