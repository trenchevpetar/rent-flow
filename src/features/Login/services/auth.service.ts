import { AppwriteException } from 'appwrite';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { account } from '@/shared/utils/api.ts';

export async function login (email: string, password: string) {
  const authStore = useAuthStore();

  try {
    await account.createEmailPasswordSession(email, password);
    
    const user = await account.get();
    authStore.setCurrentUser(user);
  } catch (err: unknown) {
    // Appwrite may throw an error
    if (
      err instanceof AppwriteException &&
      err.code === 409 &&
      err.message.includes('session is active')
    ) {
      // Recover gracefully: fetch the current user
      try {
        const user = await account.get();
        authStore.setCurrentUser(user);
      } catch (innerErr) {
        console.error('Could not fetch user after session conflict.', innerErr);
        throw innerErr;
      }
    } else {
      console.error('Login failed:', err);
      throw err;
    }
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
