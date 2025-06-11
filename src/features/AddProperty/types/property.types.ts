import type { Models } from 'appwrite';

export type Property = Partial<Models.Document> & {
  name: string;
  location: string;
  ownerId: string;
  units: number;
}
