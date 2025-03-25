import { account } from '../../../shared/utils/api.ts';

export async function login (email: string, password: string) {
  await account.createEmailPasswordSession(email, password);
}

export async function logout () {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}
