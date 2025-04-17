import { databases } from '../../../shared/utils/api.ts';
import { CONFIG } from '../../../config/config.ts';
import { ID, Query } from 'appwrite';
import type { Expenses, UpdatableExpense } from '../types/expenses.ts';
import { stripSystemFields } from '../../../shared/utils/strip-system-fields.ts';

export async function addExpenseToProperty (expense: Expenses) {
  try {
    return await databases.createDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.EXPENSES,
      ID.unique(),
      expense
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getExpensesForProperty (propertyId: string) {
  try {
    const response = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.EXPENSES,
      [
        Query.equal('propertyId', propertyId)
      ]
    )

    return response.documents
  } catch (err) {
    console.log('error fetching expenses');
    throw err;
  }
}

export async function deleteExpense (expenseId: string) {
  try {
    return await databases.deleteDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.EXPENSES,
      expenseId
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateExpenseByExpenseId (
  expenseId: string,
  expense: UpdatableExpense
) {
  const cleanExpense = stripSystemFields(expense);

  try {
    return await databases.updateDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.EXPENSES,
      expenseId,
      cleanExpense
    )
  } catch (err) {
    console.log(err);
    throw err;
  }
}
