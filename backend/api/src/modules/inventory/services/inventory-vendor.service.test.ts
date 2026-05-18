import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { INVENTORY_ERROR_CODES } from '../constants/inventory-error-codes.constant';
import type { InventoryStockRecord } from '../models/inventory-stock.model';
import * as inventoryStockRepositoryModule from '../repositories/inventory-stock.repository';
import * as inventoryStockServiceModule from './inventory-stock.service';
import { adjustVendorInventoryStock } from './inventory-vendor.service';

const inventoryStockRepository = inventoryStockRepositoryModule as unknown as {
  findInventoryStockById: (id: string) => Promise<(InventoryStockRecord & { _id: Types.ObjectId }) | null>;
};

const inventoryStockService = inventoryStockServiceModule as unknown as {
  adjustInventoryStock: (...args: unknown[]) => Promise<{ availableQuantity: number }>;
};

const stockId = new Types.ObjectId();
const vendorId = new Types.ObjectId('65f0a0000000000000000001');
const storeId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildStock = (): InventoryStockRecord & { _id: Types.ObjectId } => ({
  _id: stockId,
  storeId,
  vendorId,
  cityId: storeId,
  storeProductId: new Types.ObjectId(),
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  sku: 'SKU-1',
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

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

beforeEach(() => {
  inventoryStockRepository.findInventoryStockById = async () => buildStock();
  inventoryStockService.adjustInventoryStock = async () => ({ availableQuantity: 45 });
});

test('adjustVendorInventoryStock blocks out of scope vendor', async () => {
  await assert.rejects(
    () =>
      adjustVendorInventoryStock(
        stockId.toString(),
        { movementType: 'stock_out', quantity: 5, reason: 'Sale' },
        actorId,
        { vendorId: new Types.ObjectId().toString(), storeId: storeId.toString() },
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[INVENTORY_ERROR_CODES.INVENTORY_SCOPE_DENIED]),
  );
});
