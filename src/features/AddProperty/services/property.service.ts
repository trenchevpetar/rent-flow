import { databases } from '../../../shared/utils/api.ts';
import type { Property } from '../types/property.ts';
import { CONFIG } from '../../../config/config.ts';
import { ID, Query } from 'appwrite'

import { useAuthStore } from '../../Login/stores/useAuthStore.ts';

export async function addProperty (property: Property) {
  try {
    return await databases.createDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PROPERTIES,
      ID.unique(),
      property
    );
  } catch (err) {
    console.log(err);
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
