import type { Models } from 'appwrite';

export type Expenses  = Partial<Models.Document> & {
  propertyId: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  isPaid: boolean;
}

export type UpdatableExpense = Partial<Omit<Models.Document, '$id' | '$createdAt' | '$updatedAt' | '$collectionId' | '$databaseId' | '$permissions'>>;

