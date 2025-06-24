import type { Models } from 'appwrite';

export type Property = Partial<Models.Document> & {
  name: string;
  location: string;
  ownerId: string;
  units: number;
}

export type UpdatableProperty = Partial<Omit<Models.Document, '$id' | '$createdAt' | '$updatedAt' | '$collectionId' | '$databaseId' | '$permissions'>>;
