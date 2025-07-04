import { ID, Query } from 'appwrite';

import { CONFIG } from '@/config/config.ts';
import type { Income, UpdatableIncome } from '@/features/Income/ListIncomes/types/income.type.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { databases } from '@/shared/utils/api.ts';

export async function getIncomes (propertyId: string): Promise<Income[]> {
  try {
    const response = await databases.listDocuments<Income>(
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

export async function addIncome (income: UpdatableIncome) {
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

export async function deleteIncome (incomeId: string) {
  try {
    await databases.deleteDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.INCOME,
      incomeId
    )
  } catch (err) {
    console.log(`Error deleting income with id: ${incomeId}`)
    throw err
  }
}
