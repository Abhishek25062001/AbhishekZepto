import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';
import type { InventoryStockRecord } from '../../inventory/models/inventory-stock.model';
import * as inventoryStockRepositoryModule from '../../inventory/repositories/inventory-stock.repository';
import * as inventoryMovementServiceModule from '../../inventory/movements/services/inventory-movement.service';
import * as inventoryAdjustmentServiceModule from './order-inventory-adjustment.service';
import type { OrderRecord, StoreOrderActorContext } from '../types/order.types';
import { applyCancellationInventoryImpact } from './order-cancellation-inventory.service';

const storeId = new Types.ObjectId();
const storeProductId = new Types.ObjectId();
const movementId = new Types.ObjectId();

const inventoryStockRepository = inventoryStockRepositoryModule as unknown as {
  findInventoryStockByStoreProduct: typeof inventoryStockRepositoryModule.findInventoryStockByStoreProduct;
  updateInventoryStockById: typeof inventoryStockRepositoryModule.updateInventoryStockById;
};

const inventoryMovementService = inventoryMovementServiceModule as unknown as {
  createInventoryMovement: typeof inventoryMovementServiceModule.createInventoryMovement;
};

const inventoryAdjustmentService = inventoryAdjustmentServiceModule as unknown as {
  adjustOrderInventoryForMissingItems: typeof inventoryAdjustmentServiceModule.adjustOrderInventoryForMissingItems;
};

const actor: StoreOrderActorContext = {
  requestId: null,
  traceId: null,
  userId: new Types.ObjectId().toString(),
  role: 'store_manager',
  storeId: storeId.toString(),
};

const buildOrder = (overrides: Partial<OrderRecord> = {}): OrderRecord & { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(),
  orderNumber: 'ORD-CANCEL-INV',
  customerId: new Types.ObjectId(),
  storeId,
  checkoutSessionId: new Types.ObjectId(),
  paymentId: new Types.ObjectId(),
  paymentRecordId: null,
  paymentMethod: null,
  paymentGateway: null,
  platformFee: 0,
  payableAmount: null,
  financeStatus: null,
  paidAt: null,
  paymentFailedAt: null,
  refundCompletedAt: null,
  cartId: new Types.ObjectId(),
  addressSnapshot: {
    label: 'Home',
    line1: 'Line 1',
    line2: null,
    landmark: null,
    city: 'City',
    state: null,
    postalCode: null,
    country: 'IN',
    latitude: 0,
    longitude: 0,
  },
  items: [
    {
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      storeProductId,
      quantity: 2,
      unitPrice: 100,
      lineTotal: 200,
      productName: 'Item',
      pickedQuantity: 0,
      missingQuantity: 0,
      pickingStatus: 'pending',
    },
  ],
  subtotal: 200,
  taxAmount: 0,
  deliveryFeeAmount: 0,
  discountAmount: 0,
  grandTotal: 200,
  currency: 'INR',
  paymentStatus: 'paid',
  orderStatus: 'placed',
  storeStatus: 'pending_acceptance',
  pickerStatus: null,
  packingStatus: null,
  assignedPickerId: null,
  readyForPickupAt: null,
  acceptedAt: null,
  rejectedAt: null,
  rejectionReason: null,
  cancellationReason: null,
  cancelledAt: null,
  cancelledBy: null,
  refundReviewRequired: false,
  slaStatus: 'on_track',
  slaBreachedStage: null,
  timeline: [],
  inventoryConfirmed: true,
  placedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const buildStock = (): InventoryStockRecord & { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(),
  storeId,
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  storeProductId,
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  sku: 'SKU-CANCEL',
  storeSku: null,
  availableQuantity: 5,
  reservedQuantity: 0,
  damagedQuantity: 0,
  expiredQuantity: 0,
  totalQuantity: 5,
  lowStockThreshold: 1,
  reorderLevel: 1,
  isLowStock: false,
  isOutOfStock: false,
  lastStockUpdatedAt: null,
  lastStockMovementId: null,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

afterEach(() => {
  inventoryStockRepository.findInventoryStockByStoreProduct =
    inventoryStockRepositoryModule.findInventoryStockByStoreProduct;
  inventoryStockRepository.updateInventoryStockById =
    inventoryStockRepositoryModule.updateInventoryStockById;
  inventoryMovementService.createInventoryMovement =
    inventoryMovementServiceModule.createInventoryMovement;
  inventoryAdjustmentService.adjustOrderInventoryForMissingItems =
    inventoryAdjustmentServiceModule.adjustOrderInventoryForMissingItems;
});

test('applyCancellationInventoryImpact restocks full ordered quantity before picking', async () => {
  const stock = buildStock();
  const captured: { movement: Record<string, unknown> | null; update: Record<string, unknown> | null } = {
    movement: null,
    update: null,
  };

  inventoryStockRepository.findInventoryStockByStoreProduct = async () => stock;
  inventoryMovementService.createInventoryMovement = async (input) => {
    captured.movement = input as unknown as Record<string, unknown>;
    return {
      id: movementId.toString(),
      ...input,
      notes: input.notes ?? null,
      referenceId: input.referenceId ?? null,
      metadata: input.metadata ?? null,
      createdBy: input.createdBy ?? null,
      createdAt: new Date(),
    };
  };
  inventoryStockRepository.updateInventoryStockById = async (_stockId, payload) => {
    captured.update = payload as Record<string, unknown>;
    return { ...stock, ...payload };
  };

  const result = await applyCancellationInventoryImpact(buildOrder(), actor);

  assert.equal(result.movementCount, 1);
  assert.equal(result.restockedQuantity, 2);
  assert.equal(result.reconciledMissingItems, false);
  assert.equal(captured.movement?.movementType, 'stock_in');
  assert.equal(captured.movement?.quantity, 2);
  assert.equal(captured.movement?.newAvailableQuantity, 7);
  assert.equal(captured.movement?.newTotalQuantity, 7);
  assert.equal((captured.update?.lastStockMovementId as Types.ObjectId).toString(), movementId.toString());
});

test('applyCancellationInventoryImpact reconciles missing items and restocks picked quantity during picking', async () => {
  const stock = buildStock();
  let adjustmentCalled = false;
  let movementQuantity = 0;

  inventoryAdjustmentService.adjustOrderInventoryForMissingItems = async () => {
    adjustmentCalled = true;
    return {
      adjusted: true,
      adjustedItemCount: 1,
      items: [],
      auditMetadata: {},
    };
  };
  inventoryStockRepository.findInventoryStockByStoreProduct = async () => stock;
  inventoryMovementService.createInventoryMovement = async (input) => {
    movementQuantity = input.quantity;
    return {
      id: movementId.toString(),
      ...input,
      notes: input.notes ?? null,
      referenceId: input.referenceId ?? null,
      metadata: input.metadata ?? null,
      createdBy: input.createdBy ?? null,
      createdAt: new Date(),
    };
  };
  inventoryStockRepository.updateInventoryStockById = async (_stockId, payload) => ({
    ...stock,
    ...payload,
  });

  const result = await applyCancellationInventoryImpact(
    buildOrder({
      orderStatus: 'picking',
      pickerStatus: 'in_progress',
      items: [
        {
          productId: new Types.ObjectId(),
          variantId: new Types.ObjectId(),
          storeProductId,
          quantity: 2,
          unitPrice: 100,
          lineTotal: 200,
          productName: 'Item',
          pickedQuantity: 1,
          missingQuantity: 1,
          pickingStatus: 'partial',
        },
      ],
    }),
    actor,
  );

  assert.equal(adjustmentCalled, true);
  assert.equal(result.reconciledMissingItems, true);
  assert.equal(result.restockedQuantity, 1);
  assert.equal(movementQuantity, 1);
});
