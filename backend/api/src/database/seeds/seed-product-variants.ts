import {
  createProductVariant,
  findProductVariantBySku,
  updateProductVariantById,
} from '../../modules/catalog/variants/repositories/product-variant.repository';
import { CATALOG_PRODUCT_SEEDS } from './catalog-seed-data';
import type { ProductSeedIdMap } from './seed-products';

export const seedProductVariants = async (
  dryRun: boolean,
  productIds: ProductSeedIdMap,
): Promise<void> => {
  if (dryRun) {
    for (const product of CATALOG_PRODUCT_SEEDS) {
      for (const variant of product.variants) {
        console.log('Dry run: would upsert variant', variant.sku);
      }
    }
    return;
  }

  for (const product of CATALOG_PRODUCT_SEEDS) {
    const productId = productIds.get(product.slug);

    if (!productId) {
      throw new Error(`Missing product seed for variants: ${product.slug}`);
    }

    for (const variant of product.variants) {
      const payload = {
        productId,
        variantName: variant.variantName,
        sku: variant.sku,
        barcode: null,
        unit: variant.unit,
        unitValue: variant.unitValue,
        mrp: variant.mrp,
        defaultSellingPrice: variant.defaultSellingPrice,
        weightInGrams: null,
        lengthCm: null,
        widthCm: null,
        heightCm: null,
        imageUrl: null,
        attributeValues: null,
        isDefault: variant.isDefault ?? false,
        isVisible: true,
        status: 'active' as const,
        isDeleted: false,
        deletedAt: null,
        createdBy: null,
        updatedBy: null,
      };

      const existing = await findProductVariantBySku(variant.sku);

      if (existing) {
        await updateProductVariantById(existing._id.toString(), payload);
        console.log('Updated variant:', variant.sku);
      } else {
        await createProductVariant(payload);
        console.log('Seeded variant:', variant.sku);
      }
    }
  }
};
