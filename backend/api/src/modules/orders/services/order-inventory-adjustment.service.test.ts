import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { OrderInventoryAdjustmentInput } from '../types/order-inventory-adjustment.types';
import * as inventoryStockRepositoryModule from '../../inventory/repositories/inventory-stock.repository';
import * as inventoryMovementServiceModule from '../../inventory/movements/services/inventory-movement.service';
import * as auditModule from '../../audit/services/audit-log.service';
import {
  adjustOrderInventoryForMissingItems,
  buildOrderInventoryReconciliation,
} from './order-inventory-adjustment.service';

const inventoryStockRepository = inventoryStockRepositoryModule as unknown as {
  findInventoryStockByStoreProduct: typeof inventoryStockRepositoryModule.findInventoryStockByStoreProduct;
  updateInventoryStockById: typeof inventoryStockRepositoryModule.updateInventoryStockById;
};

const inventoryMovementService = inventoryMovementServiceModule as unknown as {
  createInventoryMovement: typeof inventoryMovementServiceModule.createInventoryMovement;
};

const auditLogService = auditModule as unknown as {
  writeAuditLog: typeof auditModule.writeAuditLog;
};

const storeId = new Types.ObjectId();
const storeProductId = new Types.ObjectId();
const movementId = new Types.ObjectId();

const buildStock = () => ({
  _id: new Types.ObjectId(),
  storeId,
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  storeProductId,
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  sku: 'SKU-TEST',
  storeSku: null,
  availableQuantity: 10,
  reservedQuantity: 0,
  damagedQuantity: 0,
  expiredQuantity: 0,
  totalQuantity: 10,
  lowStockThreshold: 1,
  reorderLevel: 1,
  isLowStock: false,
  isOutOfStock: false,
  lastStockUpdatedAt: null,
  lastStockMovementId: null,
  status: 'active' as const,
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildInput = (
  itemOverrides: Partial<OrderInventoryAdjustmentInput['items'][number]> = {},
): OrderInventoryAdjustmentInput => ({
  orderId: new Types.ObjectId().toString(),
  orderNumber: 'ORD-INV-TEST',
  storeId,
  actor: {
    requestId: null,
    traceId: null,
    userId: new Types.ObjectId().toString(),
    role: 'store_manager',
    storeId: storeId.toString(),
  },
  items: [
    {
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId,
      quantity: 2,
      pickedQuantity: 2,
      missingQuantity: 0,
      pickingStatus: 'picked',
      ...itemOverrides,
    },
  ],
});

test('buildOrderInventoryReconciliation returns picked quantity reconciliation output', () => {
  const result = buildOrderInventoryReconciliation(buildInput());

  assert.equal(result.adjusted, false);
  assert.equal(result.adjustedItemCount, 0);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.storeProductId, storeProductId.toString());
  assert.equal(result.items[0]?.pickedQuantity, 2);
  assert.equal(result.items[0]?.missingQuantity, 0);
  assert.equal(result.items[0]?.adjustmentQuantity, 2);
  assert.equal(result.items[0]?.reason, 'picked_quantity_reconciliation');
  assert.equal(result.auditMetadata.pickedQuantity, 2);
  assert.equal(result.auditMetadata.missingQuantity, 0);
});

test('buildOrderInventoryReconciliation supports fully resolved partial picked and missing quantities', () => {
  const result = buildOrderInventoryReconciliation(
    buildInput({
      pickedQuantity: 1,
      missingQuantity: 1,
      pickingStatus: 'partial',
    }),
  );

  assert.equal(result.items[0]?.pickedQuantity, 1);
  assert.equal(result.items[0]?.missingQuantity, 1);
  assert.equal(result.auditMetadata.pickedQuantity, 1);
  assert.equal(result.auditMetadata.missingQuantity, 1);
});

test('buildOrderInventoryReconciliation rejects pending picking state', () => {
  assert.throws(
    () =>
      buildOrderInventoryReconciliation(
        buildInput({
          pickedQuantity: 0,
          missingQuantity: 0,
          pickingStatus: 'pending',
        }),
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ITEM_OPERATION_INVALID);
      assert.equal(error.details.reason, 'inventory_adjustment_requires_resolved_picking_status');
      return true;
    },
  );
});

test('buildOrderInventoryReconciliation rejects incomplete picked and missing quantities', () => {
  assert.throws(
    () =>
      buildOrderInventoryReconciliation(
        buildInput({
          pickedQuantity: 1,
          missingQuantity: 0,
          pickingStatus: 'partial',
        }),
      ),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.ORDER_ITEM_OPERATION_INVALID);
      assert.equal(error.details.reason, 'inventory_adjustment_requires_fully_resolved_quantities');
      return true;
    },
  );
});

test('adjustOrderInventoryForMissingItems records movement and audit for missing quantities', async () => {
  const stock = buildStock();
  const captured: {
    movement: Record<string, unknown> | null;
    stockUpdate: Record<string, unknown> | null;
    audit: Record<string, unknown> | null;
  } = {
    movement: null,
    stockUpdate: null,
    audit: null,
  };

  inventoryStockRepository.findInventoryStockByStoreProduct = async () => stock;
  inventoryStockRepository.updateInventoryStockById = async (_stockId, payload) => {
    captured.stockUpdate = payload as Record<string, unknown>;
    return { ...stock, ...payload };
  };
  inventoryMovementService.createInventoryMovement = async (input) => {
    captured.movement = input as unknown as Record<string, unknown>;
    return {
      id: movementId.toString(),
      storeId: stock.storeId.toString(),
      vendorId: stock.vendorId.toString(),
      cityId: stock.cityId.toString(),
      inventoryStockId: stock._id.toString(),
      storeProductId: stock.storeProductId.toString(),
      productId: stock.productId.toString(),
      variantId: stock.variantId.toString(),
      movementType: input.movementType,
      quantity: input.quantity,
      previousAvailableQuantity: input.previousAvailableQuantity,
      newAvailableQuantity: input.newAvailableQuantity,
      previousReservedQuantity: input.previousReservedQuantity,
      newReservedQuantity: input.newReservedQuantity,
      previousTotalQuantity: input.previousTotalQuantity,
      newTotalQuantity: input.newTotalQuantity,
      reason: input.reason,
      referenceType: input.referenceType,
      referenceId: input.referenceId ?? null,
      notes: input.notes ?? null,
      metadata: input.metadata ?? null,
      createdBy: input.createdBy ?? null,
      createdAt: new Date(),
    };
  };
  auditLogService.writeAuditLog = async (input) => {
    captured.audit = input as unknown as Record<string, unknown>;
  };

  const result = await adjustOrderInventoryForMissingItems(
    buildInput({
      pickedQuantity: 1,
      missingQuantity: 1,
      pickingStatus: 'partial',
    }),
  );

  assert.equal(result.adjusted, true);
  assert.equal(result.adjustedItemCount, 1);
  assert.equal(result.items[0]?.reason, 'missing_item');
  assert.equal(result.items[0]?.movementId, movementId.toString());
  assert.equal(captured.movement?.movementType, 'correction');
  assert.equal(captured.movement?.quantity, 1);
  assert.equal(captured.movement?.referenceType, 'order');
  assert.equal(captured.movement?.previousAvailableQuantity, 10);
  assert.equal(captured.movement?.newAvailableQuantity, 10);
  assert.ok(captured.stockUpdate?.lastStockUpdatedAt instanceof Date);
  assert.equal((captured.stockUpdate?.lastStockMovementId as Types.ObjectId).toString(), movementId.toString());
  assert.equal(captured.audit?.eventType, 'order.inventory.adjusted');
});

test('adjustOrderInventoryForMissingItems is a no-op when no item is missing', async () => {
  let movementCalled = false;
  let auditCalled = false;

  inventoryMovementService.createInventoryMovement = async () => {
    movementCalled = true;
    throw new Error('movement should not be called');
  };
  auditLogService.writeAuditLog = async () => {
    auditCalled = true;
  };

  const result = await adjustOrderInventoryForMissingItems(buildInput());

  assert.equal(result.adjusted, false);
  assert.equal(result.adjustedItemCount, 0);
  assert.equal(movementCalled, false);
  assert.equal(auditCalled, false);
});
