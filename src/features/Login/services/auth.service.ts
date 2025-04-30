import { account } from '../../../shared/utils/api.ts';
import { useAuthStore } from '../stores/useAuthStore.ts';

export async function login (email: string, password: string) {
  const authStore = useAuthStore();

  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log(session);
    const user = await account.get();
    console.log(user);
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
