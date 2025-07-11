import { ID, Query } from 'appwrite'

import { CONFIG } from '@/config/config.ts';
import { defaultCategories } from '@/features/Property/Categories/constants/defaultCategories.ts';
import type { Category } from '@/features/Property/Categories/types/category.type.ts';
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

export async function updateCategory (
  categoryId: string,
  updates: Partial<Pick<Category, 'label' | 'icon' | 'color'>>
): Promise<Category> {
  try {
    const existingCategory = await databases.getDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.CATEGORIES,
      categoryId
    )

    const updatedData = {
      name: updates.label ?? existingCategory.name,
      icon: updates.icon ?? existingCategory.icon,
      color: updates.color ?? existingCategory.color,
    }

    const response = await databases.updateDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.CATEGORIES,
      categoryId,
      updatedData
    )

    return {
      id: response.$id,
      label: response.name,
      icon: response.icon,
      color: response.color,
      isCustom: response.isCustom ?? false,
    }
  } catch (err) {
    console.error('Failed to update category:', err)
    throw err
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

export async function getAllCategories (userId?: string): Promise<Category[]> {
  const queries = userId
    ? [Query.or([Query.equal('userId', userId), Query.isNull('userId')])]
    : [Query.isNull('userId')]

  const response = await databases.listDocuments(
    CONFIG.DATABASE_ID,
    CONFIG.COLLECTIONS.CATEGORIES,
    queries
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
}

export async function refetchCategories (propertyId: string) {
  try {
    return await databases.getDocument(
      CONFIG.DATABASE_ID,
      CONFIG.COLLECTIONS.PROPERTIES,
      propertyId
    )
  } catch (err) {
    console.error('Error refreshing category IDs:', err)
  }
}

export async function resolveCategoryLabels (
  userId: string | undefined,
  categoryIds: string[]
): Promise<Category[]> {
  const allCategories = await getAllCategories(userId);
  const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]));

  return categoryIds
    .map(id => categoryMap.get(id))
    .filter((cat): cat is Category => Boolean(cat));
}

export async function resolveCategoriesByIds (categoryIds: string[]): Promise<Category[]> {
  if (!categoryIds.length) return [];

  // Step 1: Try fetching all Appwrite categories (custom + default in DB)
  const dbResponse = await databases.listDocuments(
    CONFIG.DATABASE_ID,
    CONFIG.COLLECTIONS.CATEGORIES,
    [Query.contains('$id', categoryIds)]
  );

  const dbCategories = dbResponse.documents.map((doc) => ({
    id: doc.$id,
    label: doc.name,
    icon: doc.icon,
    color: doc.color,
    isCustom: !!doc.isCustom,
  }));

  const dbCategoryIds = new Set(dbCategories.map((cat) => cat.id));

  // Step 2: Add any default category from frontend if not found in DB
  const fallbackDefaults = defaultCategories.filter((defaultCat) =>
    defaultCat.id !== undefined &&
    categoryIds.includes(defaultCat.id) &&
    !dbCategoryIds.has(defaultCat.id)
  );

  return [...dbCategories, ...fallbackDefaults];
}


