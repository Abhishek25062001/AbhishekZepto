import { Types } from 'mongoose';
import {
  createBrand,
  findBrandBySlug,
  updateBrandById,
} from '../../modules/catalog/brands/repositories/brand.repository';
import { CATALOG_BRAND_SEEDS } from './catalog-seed-data';

export type BrandSeedIdMap = Map<string, Types.ObjectId>;

export const seedBrands = async (dryRun: boolean): Promise<BrandSeedIdMap> => {
  const ids: BrandSeedIdMap = new Map();

  if (dryRun) {
    for (const item of CATALOG_BRAND_SEEDS) {
      console.log('Dry run: would upsert brand', item.slug);
      ids.set(item.slug, new Types.ObjectId());
    }
    return ids;
  }

  for (const item of CATALOG_BRAND_SEEDS) {
    const payload = {
      name: item.name,
      slug: item.slug,
      description: null,
      logoUrl: null,
      bannerUrl: null,
      isFeatured: item.isFeatured ?? false,
      isVisible: true,
      status: 'active' as const,
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };

    const existing = await findBrandBySlug(item.slug);

    if (existing) {
      await updateBrandById(existing._id.toString(), payload);
      ids.set(item.slug, existing._id);
      console.log('Updated brand:', item.slug);
    } else {
      const created = await createBrand(payload);
      ids.set(item.slug, created._id);
      console.log('Seeded brand:', item.slug);
    }
  }

  return ids;
};
