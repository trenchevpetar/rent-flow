import { ID, Query } from 'appwrite'

import { CONFIG } from '@/config/config.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { databases } from '@/shared/utils/api.ts';

import type { Property } from '@/features/AddProperty/types/property.types.ts';

export async function addProperty (property: Property) {
  const authStore = useAuthStore();
  const ownerId = authStore.currentUser?.$id;

  try {
    return await databases.createDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PROPERTIES,
      ID.unique(),
      {
        ...property,
        ownerId: ownerId
      }
    );
  } catch (err) {
    console.log(err);
  }
}

export async function getPropertiesById (key: string, value: string) {
  if (key) {
    try {
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PROPERTIES,
        [
          Query.equal(key, value)
        ]
      )

      return response.documents
    } catch (err) {
      console.log(err);
    }
  }
}

export async function getPropertiesByOwnerId () {
  const authStore = useAuthStore();
  const ownerId = authStore.currentUser?.$id;

  if (ownerId) {
    try {
      const response = await databases.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PROPERTIES,
        [
          Query.equal('ownerId', ownerId)
        ]
      )

      return response.documents;
    } catch (err) {
      console.log('error getting properties by owner id', err);
    }
  }
}
