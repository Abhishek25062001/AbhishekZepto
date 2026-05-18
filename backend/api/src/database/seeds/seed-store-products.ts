import { findProductBySlug } from '../../modules/catalog/products/repositories/product.repository';
import { findProductVariantBySku } from '../../modules/catalog/variants/repositories/product-variant.repository';
import { findStoreByCode } from '../../modules/stores/repositories/store.repository';
import {
  createStoreProduct,
  findStoreProductByStoreAndVariant,
  updateStoreProductById,
} from '../../modules/store-products/repositories/store-product.repository';
import { STORE_PRODUCT_DISCOUNT_TYPE } from '../../modules/store-products/constants/store-product-discount-type.constant';
import { calculateFinalPrice } from '../../modules/store-products/utils/store-product-price.util';
import { STORE_INVENTORY_VARIANT_SEEDS } from './store-inventory-seed-data';

export const SEED_STORE_CODE = 'STORE-000001';

export const seedStoreProducts = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    for (const item of STORE_INVENTORY_VARIANT_SEEDS) {
      console.log(
        'Dry run: would upsert store product',
        item.variantSku,
        'for store',
        SEED_STORE_CODE,
      );
    }
    return;
  }

  const store = await findStoreByCode(SEED_STORE_CODE);

  if (!store) {
    console.log('Skipping store product seed: store not found (run seed-stores first)');
    return;
  }

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const item of STORE_INVENTORY_VARIANT_SEEDS) {
    const product = await findProductBySlug(item.productSlug);
    const variant = await findProductVariantBySku(item.variantSku);

    if (!product) {
      console.log('Skipping store product: catalog product not found', item.productSlug);
      skippedCount += 1;
      continue;
    }

    if (!variant || variant.productId.toString() !== product._id.toString()) {
      console.log('Skipping store product: catalog variant not found', item.variantSku);
      skippedCount += 1;
      continue;
    }

    const mrp = variant.mrp;
    const sellingPrice = variant.defaultSellingPrice ?? variant.mrp;
    const finalPrice = calculateFinalPrice(
      mrp,
      sellingPrice,
      STORE_PRODUCT_DISCOUNT_TYPE.NONE,
      0,
    );
    const now = new Date();

    const payload = {
      storeId: store._id,
      vendorId: store.vendorId,
      cityId: store.cityId,
      productId: product._id,
      variantId: variant._id,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sku: variant.sku,
      storeSku: `STORE-${variant.sku}`,
      mrp,
      sellingPrice,
      discountType: STORE_PRODUCT_DISCOUNT_TYPE.NONE,
      discountValue: 0,
      finalPrice,
      taxCategoryId: null,
      isAvailable: true,
      isVisible: true,
      isFeatured: product.isFeatured,
      isPriceLocked: false,
      priceUpdatedAt: now,
      availabilityUpdatedAt: now,
      status: 'active' as const,
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };

    const existing = await findStoreProductByStoreAndVariant(
      store._id.toString(),
      variant._id.toString(),
    );

    if (existing) {
      await updateStoreProductById(existing._id.toString(), payload);
      updatedCount += 1;
      console.log('Updated store product:', item.variantSku);
    } else {
      await createStoreProduct(payload);
      createdCount += 1;
      console.log('Seeded store product:', item.variantSku);
    }
  }

  console.log(
    `Store product seed completed: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped`,
  );
};
