import { Types } from 'mongoose';
import {
  createCategory,
  findCategoryBySlug,
  updateCategoryById,
} from '../../modules/catalog/categories/repositories/category.repository';
import { CATALOG_CATEGORY_SEEDS } from './catalog-seed-data';

export type CategorySeedIdMap = Map<string, Types.ObjectId>;

export const seedCategories = async (dryRun: boolean): Promise<CategorySeedIdMap> => {
  const ids: CategorySeedIdMap = new Map();

  if (dryRun) {
    for (const item of CATALOG_CATEGORY_SEEDS) {
      console.log('Dry run: would upsert category', item.slug);
      ids.set(item.slug, new Types.ObjectId());
    }
    return ids;
  }

  for (const item of CATALOG_CATEGORY_SEEDS) {
    const payload = {
      name: item.name,
      slug: item.slug,
      description: null,
      parentCategoryId: null,
      level: 1,
      displayOrder: item.displayOrder,
      iconUrl: null,
      bannerUrl: null,
      isFeatured: item.isFeatured ?? false,
      isVisible: true,
      status: 'active' as const,
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };

    const existing = await findCategoryBySlug(item.slug);

    if (existing) {
      await updateCategoryById(existing._id.toString(), payload);
      ids.set(item.slug, existing._id);
      console.log('Updated category:', item.slug);
    } else {
      const created = await createCategory(payload);
      ids.set(item.slug, created._id);
      console.log('Seeded category:', item.slug);
    }
  }

  return ids;
};
