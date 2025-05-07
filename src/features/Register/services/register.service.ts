import { ID } from 'appwrite'

import { CONFIG } from '@/config/config.ts';
import { account, databases } from '@/shared/utils/api.ts';

export async function register (email: string, password: string, name: string, phone: string) {
  const user = await account.create(ID.unique(), email, password, name);

  await databases.createDocument(
    CONFIG.DATABASE_ID,
    CONFIG.COLLECTIONS.USERS,
    ID.unique(),
    {
      userId: user.$id,
      name: user.name,
      email: user.email,
      phone,
      role: 'landlord'
    }
  )
}
