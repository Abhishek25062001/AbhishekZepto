import { Types } from 'mongoose';
import {
  createProduct,
  findProductBySlug,
  updateProductById,
} from '../../modules/catalog/products/repositories/product.repository';
import { CATALOG_PRODUCT_SEEDS } from './catalog-seed-data';
import type { BrandSeedIdMap } from './seed-brands';
import type { CategorySeedIdMap } from './seed-categories';

export type ProductSeedIdMap = Map<string, Types.ObjectId>;

export const seedProducts = async (
  dryRun: boolean,
  categoryIds: CategorySeedIdMap,
  brandIds: BrandSeedIdMap,
): Promise<ProductSeedIdMap> => {
  const ids: ProductSeedIdMap = new Map();

  if (dryRun) {
    for (const item of CATALOG_PRODUCT_SEEDS) {
      console.log('Dry run: would upsert product', item.slug);
      ids.set(item.slug, new Types.ObjectId());
    }
    return ids;
  }

  for (const item of CATALOG_PRODUCT_SEEDS) {
    const categoryId = categoryIds.get(item.categorySlug);
    const brandId = brandIds.get(item.brandSlug);

    if (!categoryId) {
      throw new Error(`Missing category seed for product ${item.slug}: ${item.categorySlug}`);
    }

    if (!brandId) {
      throw new Error(`Missing brand seed for product ${item.slug}: ${item.brandSlug}`);
    }

    const payload = {
      name: item.name,
      slug: item.slug,
      description: item.shortDescription,
      shortDescription: item.shortDescription,
      categoryId,
      subcategoryId: null,
      brandId,
      productType: item.productType,
      foodType: item.foodType,
      taxCategoryId: null,
      hsnCode: null,
      searchKeywords: item.searchKeywords,
      tags: item.searchKeywords,
      defaultImageUrl: null,
      imageUrls: [] as string[],
      attributeSummary: null,
      isFeatured: item.isFeatured ?? false,
      isVisible: true,
      approvalStatus: 'approved' as const,
      status: 'active' as const,
      approvedBy: null,
      approvedAt: new Date(),
      rejectedBy: null,
      rejectedAt: null,
      rejectionReason: null,
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };

    const existing = await findProductBySlug(item.slug);

    if (existing) {
      await updateProductById(existing._id.toString(), payload);
      ids.set(item.slug, existing._id);
      console.log('Updated product:', item.slug);
    } else {
      const created = await createProduct(payload);
      ids.set(item.slug, created._id);
      console.log('Seeded product:', item.slug);
    }
  }

  return ids;
};
