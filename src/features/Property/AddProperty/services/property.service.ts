import { ID, Query } from 'appwrite'

import { CONFIG } from '@/config/config.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { Property } from '@/features/Property/AddProperty/types/property.types.ts';
import type { Category } from '@/features/Settings/Category/AddCategory/types/category.type.ts';
import { databases } from '@/shared/utils/api.ts';

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

export async function updatePropertyCategories (propertyId: string, categories: Category[]) {
  try {
    await databases.updateDocument(CONFIG.DATABASE_ID, CONFIG.COLLECTIONS.PROPERTIES, propertyId, {
      categories
    })
  } catch (err) {
    console.log(err);
    throw err;
  }
}
