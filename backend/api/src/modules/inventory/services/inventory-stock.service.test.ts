import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { StoreProductRecord } from '../../store-products/models/store-product.model';
import * as storeProductRepositoryModule from '../../store-products/repositories/store-product.repository';
import { INVENTORY_ERROR_CODES } from '../constants/inventory-error-codes.constant';
import { INVENTORY_MOVEMENT_TYPE } from '../movements/constants/inventory-movement-type.constant';
import type { InventoryStockRecord } from '../models/inventory-stock.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as movementServiceModule from '../movements/services/inventory-movement.service';
import * as inventoryStockRepositoryModule from '../repositories/inventory-stock.repository';
import {
  adjustInventoryStockAdmin,
  createInventoryStock,
  deleteInventoryStock,
  getInventoryStockById,
} from './inventory-stock.service';

const inventoryStockRepository = inventoryStockRepositoryModule as unknown as {
  findInventoryStockById: (id: string) => Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null>;
  findInventoryStockByStoreProduct: (
    storeId: string,
    storeProductId: string,
  ) => Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null>;
  createInventoryStock: (
    payload: Partial<InventoryStockRecord>,
  ) => Promise<InventoryStockRecord & { _id: Types.ObjectId }>;
  updateInventoryStockById: (
    id: string,
    payload: Partial<InventoryStockRecord>,
  ) => Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null>;
  softDeleteInventoryStockById: (
    id: string,
    actor: Types.ObjectId | null,
  ) => Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null>;
};

const storeProductRepository = storeProductRepositoryModule as unknown as {
  findStoreProductById: (id: string) => Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null>;
};

const movementService = movementServiceModule as unknown as {
  createInventoryMovement: (...args: unknown[]) => Promise<{ id: string }>;
};

const mappingId = new Types.ObjectId();
const stockId = new Types.ObjectId();
const storeId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildMapping = (): StoreProductRecord & { _id: Types.ObjectId } => ({
  _id: mappingId,
  storeId,
  vendorId: storeId,
  cityId: storeId,
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  categoryId: new Types.ObjectId(),
  brandId: null,
  sku: 'MILK-1L',
  storeSku: null,
  mrp: 100,
  sellingPrice: 80,
  discountType: 'none',
  discountValue: 0,
  finalPrice: 80,
  taxCategoryId: null,
  isAvailable: true,
  isVisible: true,
  isFeatured: false,
  isPriceLocked: false,
  priceUpdatedAt: null,
  availabilityUpdatedAt: null,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildStock = (
  overrides: Partial<InventoryStockRecord> = {},
): InventoryStockRecord & { _id: Types.ObjectId } => ({
  _id: stockId,
  storeId,
  vendorId: storeId,
  cityId: storeId,
  storeProductId: mappingId,
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  sku: 'MILK-1L',
  storeSku: null,
  availableQuantity: 50,
  reservedQuantity: 0,
  damagedQuantity: 0,
  expiredQuantity: 0,
  totalQuantity: 50,
  lowStockThreshold: 5,
  reorderLevel: 10,
  isLowStock: false,
  isOutOfStock: false,
  lastStockUpdatedAt: new Date(),
  lastStockMovementId: null,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
  movementService.createInventoryMovement = async () => ({ id: new Types.ObjectId().toString() });
  storeProductRepository.findStoreProductById = async () => buildMapping();
});

afterEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

test('createInventoryStock creates stock with calculated total', async () => {
  inventoryStockRepository.findInventoryStockByStoreProduct = async () => null;
  inventoryStockRepository.createInventoryStock = async (payload) =>
    buildStock(payload as Partial<InventoryStockRecord>);
  inventoryStockRepository.updateInventoryStockById = async () => buildStock();

  const created = await createInventoryStock(
    { storeProductId: mappingId.toString(), availableQuantity: 50 },
    actorId,
  );

  assert.equal(created.totalQuantity, 50);
});

test('createInventoryStock rejects duplicate mapping stock', async () => {
  inventoryStockRepository.findInventoryStockByStoreProduct = async () => buildStock();

  await assert.rejects(
    () =>
      createInventoryStock({ storeProductId: mappingId.toString(), availableQuantity: 10 }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[INVENTORY_ERROR_CODES.INVENTORY_STOCK_ALREADY_EXISTS]),
  );
});

test('adjustInventoryStockAdmin increases available on stock in', async () => {
  inventoryStockRepository.findInventoryStockById = async () => buildStock();
  inventoryStockRepository.updateInventoryStockById = async (_id, payload) =>
    buildStock({ ...payload });

  const updated = await adjustInventoryStockAdmin(
    stockId.toString(),
    { movementType: INVENTORY_MOVEMENT_TYPE.STOCK_IN, quantity: 10, reason: 'Restock' },
    actorId,
  );

  assert.equal(updated.availableQuantity, 60);
});

test('deleteInventoryStock blocks when reserved quantity exists', async () => {
  inventoryStockRepository.findInventoryStockById = async () =>
    buildStock({ reservedQuantity: 2 });

  await assert.rejects(
    () => deleteInventoryStock(stockId.toString(), actorId),
    (error: unknown) =>
      isAppErrorWithCode(
        error,
        ERROR_CODES[INVENTORY_ERROR_CODES.INVENTORY_RESERVED_STOCK_EXISTS],
      ),
  );
});

test('getInventoryStockById returns not found', async () => {
  inventoryStockRepository.findInventoryStockById = async () => null;

  await assert.rejects(
    () => getInventoryStockById(stockId.toString()),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[INVENTORY_ERROR_CODES.INVENTORY_STOCK_NOT_FOUND]),
  );
});
