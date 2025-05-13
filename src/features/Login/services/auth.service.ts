import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { account } from '@/shared/utils/api.ts';

export async function login (email: string, password: string) {
  const authStore = useAuthStore();

  try {
    await account.deleteSession('current');
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    authStore.setCurrentUser(user)

  } catch (err) {
    console.log(err, 'login failed');
    throw err;
  }
}

export async function logout () {
  const authStore = useAuthStore();

  try {
    await account.deleteSession('current');
    authStore.setCurrentUser(null);
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}
