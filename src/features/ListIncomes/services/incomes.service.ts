import { ID, Query } from 'appwrite';

import { CONFIG } from '@/config/config.ts';
import type { Incomes } from '@/features/ListIncomes/types/incomes.types.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { databases } from '@/shared/utils/api.ts';

export async function getIncomes (propertyId: string): Promise<Incomes[]> {
  try {
    const response = await databases.listDocuments<Incomes>(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.INCOME,
      [
        Query.equal('propertyId', propertyId)
      ]
    )

    return response.documents;
  } catch (err) {
    console.log('error fetching incomes');
    throw err;
  }
}

export async function addIncome (income: Incomes) {
  const authStore = useAuthStore();
  const ownerId = authStore.currentUser?.$id;

  try {
    return await databases.createDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.INCOME,
      ID.unique(),
      {
        ...income,
        propertyId: ownerId
      }
    );
  } catch (err) {
    console.log(err);
  }
}