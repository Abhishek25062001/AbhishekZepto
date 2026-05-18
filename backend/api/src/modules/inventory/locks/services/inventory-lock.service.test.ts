import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { INVENTORY_MOVEMENT_TYPE } from '../../movements/constants/inventory-movement-type.constant';
import { INVENTORY_STOCK_STATUS } from '../../constants/inventory-stock-status.constant';
import type { InventoryStockRecord } from '../../models/inventory-stock.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as movementServiceModule from '../../movements/services/inventory-movement.service';
import * as stockRepositoryModule from '../../repositories/inventory-stock.repository';
import { INVENTORY_LOCK_ERROR_CODES } from '../constants/inventory-lock-error-codes.constant';
import { INVENTORY_LOCK_STATUS } from '../constants/inventory-lock-status.constant';
import { INVENTORY_LOCK_TYPE } from '../constants/inventory-lock-type.constant';
import type { InventoryLockRecord } from '../models/inventory-lock.model';
import * as lockRepositoryModule from '../repositories/inventory-lock.repository';
import * as lockReferenceServiceModule from './inventory-lock-reference.service';
import {
  confirmInventoryLock,
  createInventoryLock,
  releaseInventoryLock,
} from './inventory-lock.service';

const stockId = new Types.ObjectId();
const lockId = new Types.ObjectId();
const storeProductId = new Types.ObjectId();

const stockRepository = stockRepositoryModule as unknown as {
  findInventoryStockById: (id: string) => Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null>;
  updateInventoryStockById: (
    id: string,
    payload: Partial<InventoryStockRecord>,
  ) => Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null>;
};

const lockRepository = lockRepositoryModule as unknown as {
  createInventoryLock: (payload: Partial<InventoryLockRecord>) => Promise<InventoryLockRecord & { _id: Types.ObjectId }>;
  findInventoryLockByToken: (token: string) => Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null>;
  markLockReleased: (
    id: string,
    reason: string,
    actor: Types.ObjectId | null,
  ) => Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null>;
  markLockConfirmed: (
    id: string,
    reason: string,
    orderId: Types.ObjectId | null,
    actor: Types.ObjectId | null,
  ) => Promise<(InventoryLockRecord & { _id: Types.ObjectId }) | null>;
};

const movementService = movementServiceModule as unknown as {
  createInventoryMovement: (...args: unknown[]) => Promise<{ id: string }>;
};

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const lockReferenceService = lockReferenceServiceModule as unknown as {
  assertInventoryStockForLock: (
    inventoryStockId: string,
    storeProductId: string,
  ) => Promise<InventoryStockRecord & { _id: Types.ObjectId }>;
};

const buildStock = (
  overrides: Partial<InventoryStockRecord> = {},
): InventoryStockRecord & { _id: Types.ObjectId } => ({
  _id: stockId,
  storeId: new Types.ObjectId(),
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  storeProductId,
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  sku: 'MILK-1L',
  storeSku: null,
  availableQuantity: 20,
  reservedQuantity: 0,
  damagedQuantity: 0,
  expiredQuantity: 0,
  totalQuantity: 20,
  lowStockThreshold: 5,
  reorderLevel: 0,
  isLowStock: false,
  isOutOfStock: false,
  lastStockUpdatedAt: null,
  lastStockMovementId: null,
  status: INVENTORY_STOCK_STATUS.ACTIVE,
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const buildLock = (
  overrides: Partial<InventoryLockRecord> = {},
): InventoryLockRecord & { _id: Types.ObjectId } => ({
  _id: lockId,
  storeId: new Types.ObjectId(),
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  inventoryStockId: stockId,
  storeProductId,
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  customerId: null,
  cartId: null,
  orderId: null,
  lockToken: 'lock_testtoken',
  lockType: INVENTORY_LOCK_TYPE.CART,
  quantity: 5,
  status: INVENTORY_LOCK_STATUS.ACTIVE,
  expiresAt: new Date(Date.now() + 600_000),
  releasedAt: null,
  confirmedAt: null,
  releaseReason: null,
  confirmationReason: null,
  metadata: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
  movementService.createInventoryMovement = async () => ({ id: new Types.ObjectId().toString() });
  lockReferenceService.assertInventoryStockForLock = async () => buildStock();
});

afterEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

test('createInventoryLock reserves stock and returns lock', async () => {
  stockRepository.updateInventoryStockById = async (_id, payload) =>
    buildStock({
      availableQuantity: payload.availableQuantity ?? 15,
      reservedQuantity: payload.reservedQuantity ?? 5,
    });
  lockRepository.createInventoryLock = async (payload) =>
    buildLock({
      lockToken: payload.lockToken ?? 'lock_new',
      quantity: payload.quantity ?? 5,
    });

  const result = await createInventoryLock(
    {
      inventoryStockId: stockId.toString(),
      storeProductId: storeProductId.toString(),
      quantity: 5,
      lockType: INVENTORY_LOCK_TYPE.CART,
    },
    'actor-1',
  );

  assert.equal(result.quantity, 5);
  assert.equal(result.status, INVENTORY_LOCK_STATUS.ACTIVE);
});

test('createInventoryLock rejects insufficient stock', async () => {
  lockReferenceService.assertInventoryStockForLock = async () =>
    buildStock({ availableQuantity: 2 });

  await assert.rejects(
    () =>
      createInventoryLock(
        {
          inventoryStockId: stockId.toString(),
          storeProductId: storeProductId.toString(),
          quantity: 5,
          lockType: INVENTORY_LOCK_TYPE.CART,
        },
        'actor-1',
      ),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES[INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_INSUFFICIENT_STOCK],
  );
});

test('releaseInventoryLock is idempotent when already released', async () => {
  const released = buildLock({ status: INVENTORY_LOCK_STATUS.RELEASED });
  lockRepository.findInventoryLockByToken = async () => released;

  const result = await releaseInventoryLock(
    { lockToken: 'lock_testtoken', releaseReason: 'cart cleared' },
    'actor-1',
  );

  assert.equal(result.status, INVENTORY_LOCK_STATUS.RELEASED);
});

test('confirmInventoryLock blocks when lock already released', async () => {
  lockRepository.findInventoryLockByToken = async () =>
    buildLock({ status: INVENTORY_LOCK_STATUS.RELEASED });

  await assert.rejects(
    () =>
      confirmInventoryLock(
        { lockToken: 'lock_testtoken', confirmationReason: 'order placed' },
        'actor-1',
      ),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES[INVENTORY_LOCK_ERROR_CODES.INVENTORY_LOCK_CONFIRM_BLOCKED],
  );
});

test('releaseInventoryLock restores stock for active lock', async () => {
  const active = buildLock();
  lockRepository.findInventoryLockByToken = async () => active;
  stockRepository.findInventoryStockById = async () => buildStock({ reservedQuantity: 5, availableQuantity: 15 });
  stockRepository.updateInventoryStockById = async () =>
    buildStock({ reservedQuantity: 0, availableQuantity: 20 });
  lockRepository.markLockReleased = async () =>
    buildLock({ status: INVENTORY_LOCK_STATUS.RELEASED, releaseReason: 'done' });

  const result = await releaseInventoryLock(
    { lockToken: 'lock_testtoken', releaseReason: 'cart cleared' },
    'actor-1',
  );

  assert.equal(result.status, INVENTORY_LOCK_STATUS.RELEASED);
});

test('confirmInventoryLock confirms active lock', async () => {
  const active = buildLock();
  lockRepository.findInventoryLockByToken = async () => active;
  stockRepository.findInventoryStockById = async () => buildStock({ reservedQuantity: 5, availableQuantity: 15 });
  stockRepository.updateInventoryStockById = async () =>
    buildStock({ reservedQuantity: 0, availableQuantity: 15 });
  lockRepository.markLockConfirmed = async () =>
    buildLock({ status: INVENTORY_LOCK_STATUS.CONFIRMED });

  const result = await confirmInventoryLock(
    { lockToken: 'lock_testtoken', confirmationReason: 'order placed' },
    'actor-1',
  );

  assert.equal(result.status, INVENTORY_LOCK_STATUS.CONFIRMED);
});

test('createInventoryLock records reservation_created movement', async () => {
  let movementType: string | undefined;
  stockRepository.updateInventoryStockById = async () => buildStock();
  lockRepository.createInventoryLock = async () => buildLock();
  movementService.createInventoryMovement = async (...args: unknown[]) => {
    const input = args[0] as { movementType: string };
    movementType = input.movementType;
    return { id: new Types.ObjectId().toString() };
  };

  await createInventoryLock(
    {
      inventoryStockId: stockId.toString(),
      storeProductId: storeProductId.toString(),
      quantity: 2,
      lockType: INVENTORY_LOCK_TYPE.CART,
    },
    'actor-1',
  );

  assert.equal(movementType, INVENTORY_MOVEMENT_TYPE.RESERVATION_CREATED);
});
