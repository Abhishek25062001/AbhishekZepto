import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { VARIANT_ERROR_CODES } from '../constants/variant-error-codes.constant';
import type { ProductVariantRecord } from '../models/product-variant.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as variantRepositoryModule from '../repositories/product-variant.repository';
import * as variantProductReferenceModule from './variant-product-reference.service';
import * as variantUnitReferenceModule from './variant-unit-reference.service';
import * as storeProductRepositoryModule from '../../../store-products/repositories/store-product.repository';
import {
  createProductVariant,
  deleteProductVariant,
  updateProductVariant,
} from './product-variant.service';

type VariantRepositoryModule = {
  countActiveVariantsByProduct: (productId: string) => Promise<number>;
  findProductVariantBySku: (
    sku: string,
    excludeId?: string,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
  findProductVariantByBarcode: (
    barcode: string,
    excludeId?: string,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
  clearDefaultVariantForProduct: (productId: string, excludeVariantId?: string) => Promise<void>;
  createProductVariant: (
    payload: Partial<ProductVariantRecord>,
  ) => Promise<ProductVariantRecord & { _id: Types.ObjectId }>;
  findProductVariantByProductAndId: (
    productId: string,
    variantId: string,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
  updateProductVariantById: (
    variantId: string,
    payload: Partial<ProductVariantRecord>,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
  findOldestActiveVariantForProduct: (
    productId: string,
    excludeVariantId: string,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
  setDefaultVariantById: (
    variantId: string,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
  softDeleteProductVariantById: (
    variantId: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
};

const variantRepository = variantRepositoryModule as unknown as VariantRepositoryModule;
const variantProductReference = variantProductReferenceModule as unknown as {
  assertProductExistsForVariant: (productId: string) => Promise<unknown>;
};
const variantUnitReference = variantUnitReferenceModule as unknown as {
  assertVariantUnitIsValid: (unit: string) => Promise<unknown>;
};
const storeProductRepository = storeProductRepositoryModule as unknown as {
  countStoreProductsByVariant: (variantId: string) => Promise<number>;
};
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const noopAuditLog = async () => undefined;

const originalRepository: VariantRepositoryModule = {
  countActiveVariantsByProduct: variantRepository.countActiveVariantsByProduct,
  findProductVariantBySku: variantRepository.findProductVariantBySku,
  findProductVariantByBarcode: variantRepository.findProductVariantByBarcode,
  clearDefaultVariantForProduct: variantRepository.clearDefaultVariantForProduct,
  createProductVariant: variantRepository.createProductVariant,
  findProductVariantByProductAndId: variantRepository.findProductVariantByProductAndId,
  updateProductVariantById: variantRepository.updateProductVariantById,
  findOldestActiveVariantForProduct: variantRepository.findOldestActiveVariantForProduct,
  setDefaultVariantById: variantRepository.setDefaultVariantById,
  softDeleteProductVariantById: variantRepository.softDeleteProductVariantById,
};

const productId = new Types.ObjectId();
const variantId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildVariant = (
  overrides: Partial<ProductVariantRecord & { _id: Types.ObjectId }> = {},
): ProductVariantRecord & { _id: Types.ObjectId } => ({
  _id: variantId,
  productId,
  variantName: '500 g',
  sku: 'MILK-500',
  barcode: null,
  unit: 'g',
  unitValue: 500,
  mrp: 60,
  defaultSellingPrice: 55,
  weightInGrams: 500,
  lengthCm: null,
  widthCm: null,
  heightCm: null,
  imageUrl: null,
  attributeValues: null,
  isDefault: true,
  isVisible: true,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

beforeEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  variantProductReference.assertProductExistsForVariant = async () => ({});
  variantUnitReference.assertVariantUnitIsValid = async () => ({});
  storeProductRepository.countStoreProductsByVariant = async () => 0;
});

afterEach(() => {
  variantRepository.countActiveVariantsByProduct = originalRepository.countActiveVariantsByProduct;
  variantRepository.findProductVariantBySku = originalRepository.findProductVariantBySku;
  variantRepository.findProductVariantByBarcode = originalRepository.findProductVariantByBarcode;
  variantRepository.clearDefaultVariantForProduct = originalRepository.clearDefaultVariantForProduct;
  variantRepository.createProductVariant = originalRepository.createProductVariant;
  variantRepository.findProductVariantByProductAndId =
    originalRepository.findProductVariantByProductAndId;
  variantRepository.updateProductVariantById = originalRepository.updateProductVariantById;
  variantRepository.findOldestActiveVariantForProduct =
    originalRepository.findOldestActiveVariantForProduct;
  variantRepository.setDefaultVariantById = originalRepository.setDefaultVariantById;
  variantRepository.softDeleteProductVariantById = originalRepository.softDeleteProductVariantById;
});

test('createProductVariant creates variant with default for first sku', async () => {
  variantRepository.countActiveVariantsByProduct = async () => 0;
  variantRepository.findProductVariantBySku = async () => null;
  variantRepository.findProductVariantByBarcode = async () => null;
  variantRepository.createProductVariant = async (payload) =>
    buildVariant({ ...payload, _id: variantId });

  const created = await createProductVariant(
    productId.toString(),
    {
      variantName: '500 g',
      sku: 'milk-500',
      unit: 'g',
      unitValue: 500,
      mrp: 60,
    },
    actorId,
  );

  assert.equal(created.sku, 'MILK-500');
  assert.equal(created.isDefault, true);
});

test('createProductVariant rejects duplicate sku', async () => {
  variantRepository.countActiveVariantsByProduct = async () => 1;
  variantRepository.findProductVariantBySku = async () => buildVariant();

  await assert.rejects(
    () =>
      createProductVariant(
        productId.toString(),
        {
          variantName: '1 L',
          sku: 'MILK-1L',
          unit: 'litre',
          unitValue: 1,
          mrp: 100,
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[VARIANT_ERROR_CODES.SKU_ALREADY_EXISTS]),
  );
});

test('createProductVariant rejects invalid unit', async () => {
  variantRepository.countActiveVariantsByProduct = async () => 0;
  variantRepository.findProductVariantBySku = async () => null;
  variantUnitReference.assertVariantUnitIsValid = async () => {
    throw new AppError({
      message: 'Invalid product unit',
      statusCode: 422,
      errorCode: ERROR_CODES[VARIANT_ERROR_CODES.INVALID_VARIANT_UNIT],
    });
  };

  await assert.rejects(
    () =>
      createProductVariant(
        productId.toString(),
        {
          variantName: '500 g',
          sku: 'MILK-500',
          unit: 'invalid',
          unitValue: 500,
          mrp: 60,
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[VARIANT_ERROR_CODES.INVALID_VARIANT_UNIT]),
  );
});

test('createProductVariant clears sibling default when isDefault true', async () => {
  let cleared = false;
  variantRepository.countActiveVariantsByProduct = async () => 1;
  variantRepository.findProductVariantBySku = async () => null;
  variantRepository.clearDefaultVariantForProduct = async () => {
    cleared = true;
  };
  variantRepository.createProductVariant = async (payload) =>
    buildVariant({ ...payload, isDefault: true });

  await createProductVariant(
    productId.toString(),
    {
      variantName: '1 L',
      sku: 'MILK-1L',
      unit: 'litre',
      unitValue: 1,
      mrp: 100,
      isDefault: true,
    },
    actorId,
  );

  assert.equal(cleared, true);
});

test('updateProductVariant updates sku when unique', async () => {
  const existing = buildVariant();
  variantRepository.findProductVariantByProductAndId = async () => existing;
  variantRepository.findProductVariantBySku = async () => null;
  variantRepository.updateProductVariantById = async (_id, payload) =>
    buildVariant({ ...existing, ...payload, sku: 'MILK-1L' });

  const updated = await updateProductVariant(
    productId.toString(),
    variantId.toString(),
    { sku: 'milk-1l' },
    actorId,
  );

  assert.equal(updated.sku, 'MILK-1L');
});

test('updateProductVariant returns not found for wrong product', async () => {
  variantRepository.findProductVariantByProductAndId = async () => null;

  await assert.rejects(
    () =>
      updateProductVariant(
        productId.toString(),
        variantId.toString(),
        { variantName: 'Updated' },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[VARIANT_ERROR_CODES.VARIANT_NOT_FOUND]),
  );
});

test('deleteProductVariant promotes replacement default before delete', async () => {
  const existing = buildVariant({ isDefault: true });
  const replacementId = new Types.ObjectId();
  let promoted = false;

  variantRepository.findProductVariantByProductAndId = async () => existing;
  variantRepository.countActiveVariantsByProduct = async () => 2;
  variantRepository.findOldestActiveVariantForProduct = async () =>
    buildVariant({ _id: replacementId, isDefault: false });
  variantRepository.setDefaultVariantById = async (id) => {
    promoted = id === replacementId.toString();
    return buildVariant({ _id: replacementId, isDefault: true });
  };
  variantRepository.softDeleteProductVariantById = async () =>
    buildVariant({ isDeleted: true, status: 'archived', isDefault: false });

  await deleteProductVariant(productId.toString(), variantId.toString(), actorId);

  assert.equal(promoted, true);
});

test('deleteProductVariant blocks when no replacement exists', async () => {
  const existing = buildVariant({ isDefault: true });

  variantRepository.findProductVariantByProductAndId = async () => existing;
  variantRepository.countActiveVariantsByProduct = async () => 2;
  variantRepository.findOldestActiveVariantForProduct = async () => null;

  await assert.rejects(
    () => deleteProductVariant(productId.toString(), variantId.toString(), actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[VARIANT_ERROR_CODES.DEFAULT_VARIANT_REQUIRED]),
  );
});
