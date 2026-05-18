import { Types } from 'mongoose';
import { findProductVariantBySku } from '../../modules/catalog/variants/repositories/product-variant.repository';
import { INVENTORY_REFERENCE_TYPE } from '../../modules/inventory/movements/constants/inventory-reference-type.constant';
import { INVENTORY_MOVEMENT_TYPE } from '../../modules/inventory/movements/constants/inventory-movement-type.constant';
import { createInventoryMovement } from '../../modules/inventory/movements/repositories/inventory-movement.repository';
import {
  createInventoryStock,
  findInventoryStockByStoreProduct,
  updateInventoryStockById,
} from '../../modules/inventory/repositories/inventory-stock.repository';
import { calculateStockFlags, calculateTotalQuantity } from '../../modules/inventory/utils/inventory-quantity.util';
import { findStoreByCode } from '../../modules/stores/repositories/store.repository';
import {
  findStoreProductByStoreAndVariant,
} from '../../modules/store-products/repositories/store-product.repository';
import { SEED_STORE_CODE } from './seed-store-products';
import { STORE_INVENTORY_VARIANT_SEEDS } from './store-inventory-seed-data';

export const seedInventory = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    for (const item of STORE_INVENTORY_VARIANT_SEEDS) {
      console.log(
        'Dry run: would upsert inventory stock',
        item.variantSku,
        'qty',
        item.availableQuantity,
        'for store',
        SEED_STORE_CODE,
      );
    }
    return;
  }

  const store = await findStoreByCode(SEED_STORE_CODE);

  if (!store) {
    console.log('Skipping inventory seed: store not found (run seed-stores first)');
    return;
  }

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const item of STORE_INVENTORY_VARIANT_SEEDS) {
    const variant = await findProductVariantBySku(item.variantSku);

    if (!variant) {
      console.log('Skipping inventory: variant not found', item.variantSku);
      skippedCount += 1;
      continue;
    }

    const mapping = await findStoreProductByStoreAndVariant(
      store._id.toString(),
      variant._id.toString(),
    );

    if (!mapping) {
      console.log('Skipping inventory: store product not found for', item.variantSku);
      skippedCount += 1;
      continue;
    }

    const stockFlags = calculateStockFlags(item.availableQuantity, item.lowStockThreshold);
    const totalQuantity = calculateTotalQuantity(
      item.availableQuantity,
      0,
      0,
      0,
    );
    const now = new Date();

    const payload = {
      storeId: store._id,
      vendorId: store.vendorId,
      cityId: store.cityId,
      storeProductId: mapping._id,
      productId: mapping.productId,
      variantId: mapping.variantId,
      sku: mapping.sku,
      storeSku: mapping.storeSku,
      availableQuantity: item.availableQuantity,
      reservedQuantity: 0,
      damagedQuantity: 0,
      expiredQuantity: 0,
      totalQuantity,
      lowStockThreshold: item.lowStockThreshold,
      reorderLevel: item.reorderLevel,
      ...stockFlags,
      lastStockUpdatedAt: now,
      status: 'active' as const,
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };

    const existing = await findInventoryStockByStoreProduct(
      store._id.toString(),
      mapping._id.toString(),
    );

    if (existing) {
      await updateInventoryStockById(existing._id.toString(), {
        ...payload,
        lastStockMovementId: existing.lastStockMovementId,
      });
      updatedCount += 1;
      console.log('Updated inventory stock:', item.variantSku);
      continue;
    }

    const created = await createInventoryStock(payload);

    const movement = await createInventoryMovement({
      storeId: store._id,
      vendorId: store.vendorId,
      cityId: store.cityId,
      inventoryStockId: created._id,
      storeProductId: mapping._id,
      productId: mapping.productId,
      variantId: mapping.variantId,
      movementType: INVENTORY_MOVEMENT_TYPE.STOCK_IN,
      quantity: item.availableQuantity,
      previousAvailableQuantity: 0,
      newAvailableQuantity: item.availableQuantity,
      previousReservedQuantity: 0,
      newReservedQuantity: 0,
      previousTotalQuantity: 0,
      newTotalQuantity: totalQuantity,
      reason: 'Seed opening stock',
      referenceType: INVENTORY_REFERENCE_TYPE.SEED,
      referenceId: `opening-${item.variantSku}`,
      notes: null,
      metadata: null,
      createdBy: null,
    });

    await updateInventoryStockById(created._id.toString(), {
      lastStockMovementId: new Types.ObjectId(movement._id.toString()),
    });

    createdCount += 1;
    console.log('Seeded inventory stock:', item.variantSku);
  }

  console.log(
    `Inventory seed completed: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped`,
  );
};
