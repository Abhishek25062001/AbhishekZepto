import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { STORE_PRODUCT_ERROR_CODES } from '../constants/store-product-error-codes.constant';
import type { StoreProductRecord } from '../models/store-product.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as storeProductRepositoryModule from '../repositories/store-product.repository';
import { updateVendorStoreProductPrice } from './store-product-vendor.service';

const storeProductRepository = storeProductRepositoryModule as unknown as {
  findStoreProductById: (id: string) => Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null>;
  updateStoreProductById: (
    id: string,
    payload: Partial<StoreProductRecord>,
  ) => Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null>;
};

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const mappingId = new Types.ObjectId();
const vendorId = new Types.ObjectId('65f0a0000000000000000001');
const storeId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildMapping = (
  overrides: Partial<StoreProductRecord> = {},
): StoreProductRecord & { _id: Types.ObjectId } => ({
  _id: mappingId,
  storeId,
  vendorId,
  cityId: storeId,
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  categoryId: new Types.ObjectId(),
  brandId: null,
  sku: 'SKU-1',
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
  ...overrides,
});

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

afterEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

test('updateVendorStoreProductPrice blocks when price is locked', async () => {
  storeProductRepository.findStoreProductById = async () =>
    buildMapping({ isPriceLocked: true });

  await assert.rejects(
    () =>
      updateVendorStoreProductPrice(
        mappingId.toString(),
        { sellingPrice: 70 },
        actorId,
        { vendorId: vendorId.toString(), storeId: storeId.toString() },
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_PRICE_LOCKED]),
  );
});

test('updateVendorStoreProductPrice blocks out of scope vendor', async () => {
  storeProductRepository.findStoreProductById = async () => buildMapping();

  await assert.rejects(
    () =>
      updateVendorStoreProductPrice(
        mappingId.toString(),
        { sellingPrice: 70 },
        actorId,
        { vendorId: new Types.ObjectId().toString(), storeId: storeId.toString() },
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_SCOPE_DENIED]),
  );
});
