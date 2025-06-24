import { ID, Query } from 'appwrite'

import { CONFIG } from '@/config/config.ts';
import { defaultCategories } from '@/features/Settings/Category/AddCategory/constants/defaultCategories.ts';
import type { Category } from '@/features/Settings/Category/AddCategory/types/category.type.ts';
import { databases } from '@/shared/utils/api.ts';

function needsDatabaseCreation (category: Category | Omit<Category, 'id'>): boolean | string {
  return !('id' in category) ||
    !category.id ||
    (category.id && category.id.startsWith('custom-'))
}

// Add a single category to a property
export async function addCategoryToProperty (
  propertyId: string,
  userId: string,
  category: Category | Omit<Category, 'id'>
): Promise<Category> {
  try {
    let categoryIdToAdd: string;
    let categoryToReturn: Category;

    if (needsDatabaseCreation(category)) {
      // Create new category in database (can be custom or predefined)
      const categoryId = 'id' in category && category.id && !category.id.startsWith('custom-')
        ? category.id
        : ID.unique();

      const response = await databases.createDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.CATEGORIES,
        categoryId,
        {
          name: category.label,
          icon: category.icon || '',
          color: category.color || '',
          isCustom: category.isCustom || false,
          userId: category.isCustom ? userId : null,
        }
      );

      categoryIdToAdd = response.$id;
      categoryToReturn = {
        id: response.$id,
        label: category.label,
        icon: category.icon,
        color: category.color,
        isCustom: category.isCustom || false
      };
    } else {
      categoryIdToAdd = (category as Category).id || '';
      categoryToReturn = category as Category;
    }

    const property = await databases.getDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PROPERTIES,
      propertyId
    );

    const currentCategoryIds: string[] = property.categoryIds || [];

    if (!currentCategoryIds.includes(categoryIdToAdd)) {
      const updatedCategoryIds = [...currentCategoryIds, categoryIdToAdd];

      await databases.updateDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTIONS.PROPERTIES,
        propertyId,
        {
          categoryIds: updatedCategoryIds,
        }
      );
    }

    return categoryToReturn;
  } catch (err) {
    console.error('Failed to add category to property:', err);
    throw err;
  }
}

// Remove a category from a property
export async function removeCategoryFromProperty (
  propertyId: string,
  categoryId: string
): Promise<void> {
  try {
    // Get current property
    const property = await databases.getDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PROPERTIES,
      propertyId
    );

    const currentCategoryIds: string[] = property.categoryIds || [];
    const updatedCategoryIds = currentCategoryIds.filter(id => id !== categoryId);

    await databases.updateDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PROPERTIES,
      propertyId,
      {
        categoryIds: updatedCategoryIds,
      }
    );
  } catch (err) {
    console.error('Failed to remove category from property:', err);
    throw err;
  }
}

export async function getAllCategories (userId: string): Promise<Category[]> {
  try {
    const response = await databases.listDocuments(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.CATEGORIES,
      [
        Query.or([
          Query.equal('userId', userId),
          Query.isNull('userId')
        ])
      ]
    );

    const dbCategories = response.documents.map(doc => ({
      id: doc.$id,
      label: doc.name,
      icon: doc.icon,
      color: doc.color,
      isCustom: doc.isCustom || false
    }));

    const existingLabels = new Set(dbCategories.map(cat => cat.label.toLowerCase()));
    const missingDefaults = defaultCategories.filter(
      defaultCat => !existingLabels.has(defaultCat.label.toLowerCase())
    );

    return [...dbCategories, ...missingDefaults];
  } catch (err) {
    console.error('Failed to get categories:', err);
    throw err;
  }
}

export async function resolveCategoryLabels (
  userId: string,
  categoryIds: string[]
): Promise<Category[]> {
  const allCategories = await getAllCategories(userId);
  const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

  return categoryIds
    .map((id) => categoryMap.get(id))
    .filter((cat): cat is Category => Boolean(cat));
}

