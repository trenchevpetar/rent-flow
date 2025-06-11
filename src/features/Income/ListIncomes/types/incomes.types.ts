import type { Models } from 'appwrite';

export type Incomes  = Models.Document & {
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  amount: number;
  type: string;
  datePaid: string;
}

export type UpdatableIncome = Partial<Omit<Models.Document, '$id' | '$createdAt' | '$updatedAt' | '$collectionId' | '$databaseId' | '$permissions'>>;

