import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { PRODUCT_APPROVAL_STATUS } from '../../catalog/products/constants/product-approval-status.constant';
import type { ProductRecord } from '../../catalog/products/models/product.model';
import * as productRepositoryModule from '../../catalog/products/repositories/product.repository';
import type { ProductVariantRecord } from '../../catalog/variants/models/product-variant.model';
import * as variantRepositoryModule from '../../catalog/variants/repositories/product-variant.repository';
import type { StoreRecord } from '../../stores/models/store.model';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import { STORE_PRODUCT_ERROR_CODES } from '../constants/store-product-error-codes.constant';
import type { StoreProductRecord } from '../models/store-product.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as inventoryStockRepositoryModule from '../../inventory/repositories/inventory-stock.repository';
import * as storeProductRepositoryModule from '../repositories/store-product.repository';
import { createStoreProduct, deleteStoreProduct, getStoreProductById } from './store-product.service';

const storeProductRepository = storeProductRepositoryModule as unknown as {
  findStoreProductById: (id: string) => Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null>;
  findStoreProductByStoreAndVariant: (
    storeId: string,
    variantId: string,
  ) => Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null>;
  findStoreProductByStoreSku: (
    storeId: string,
    sku: string,
  ) => Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null>;
  createStoreProduct: (
    payload: Partial<StoreProductRecord>,
  ) => Promise<StoreProductRecord & { _id: Types.ObjectId }>;
  softDeleteStoreProductById: (
    id: string,
    actor: Types.ObjectId | null,
  ) => Promise<(StoreProductRecord & { _id: Types.ObjectId }) | null>;
};

const storeRepository = storeRepositoryModule as unknown as {
  findStoreById: (id: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
};

const productRepository = productRepositoryModule as unknown as {
  findProductById: (id: string) => Promise<(ProductRecord & { _id: Types.ObjectId }) | null>;
};

const variantRepository = variantRepositoryModule as unknown as {
  findProductVariantByProductAndId: (
    productId: string,
    variantId: string,
  ) => Promise<(ProductVariantRecord & { _id: Types.ObjectId }) | null>;
};

const inventoryStockRepository = inventoryStockRepositoryModule as unknown as {
  countInventoryStocksByStoreProduct: (storeProductId: string) => Promise<number>;
};

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const noopAuditLog = async () => undefined;

const storeId = new Types.ObjectId();
const productId = new Types.ObjectId();
const variantId = new Types.ObjectId();
const mappingId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildStore = (): StoreRecord & { _id: Types.ObjectId } => ({
  _id: storeId,
  vendorId: new Types.ObjectId('65f0a0000000000000000001'),
  cityId: new Types.ObjectId(),
  serviceAreaIds: [],
  name: 'Zepto Dwarka',
  slug: 'zepto-dwarka',
  code: 'STORE-000001',
  description: null,
  phone: '9999999999',
  email: null,
  addressLine1: 'Sector 10',
  addressLine2: null,
  landmark: null,
  pincode: '110075',
  latitude: 28.5,
  longitude: 77.0,
  serviceRadiusKm: 5,
  openingTime: '08:00',
  closingTime: '22:00',
  operatingDays: ['mon'],
  isOpen: true,
  isAcceptingOrders: true,
  temporaryClosureReason: null,
  storeType: 'grocery',
  fulfillmentType: 'delivery',
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildProduct = (): ProductRecord & { _id: Types.ObjectId } => ({
  _id: productId,
  name: 'Milk',
  slug: 'milk',
  description: null,
  shortDescription: null,
  categoryId: new Types.ObjectId(),
  subcategoryId: null,
  brandId: null,
  productType: 'simple',
  foodType: null,
  taxCategoryId: null,
  hsnCode: null,
  searchKeywords: [],
  tags: [],
  defaultImageUrl: null,
  imageUrls: [],
  attributeSummary: null,
  isFeatured: false,
  isVisible: true,
  approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED,
  status: 'active',
  approvedBy: null,
  approvedAt: null,
  rejectedBy: null,
  rejectedAt: null,
  rejectionReason: null,
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const buildVariant = (): ProductVariantRecord & { _id: Types.ObjectId } => ({
  _id: variantId,
  productId,
  variantName: '1L',
  sku: 'MILK-1L',
  barcode: null,
  unit: 'litre',
  unitValue: 1,
  mrp: 60,
  defaultSellingPrice: 55,
  weightInGrams: null,
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
  createdAt: new Date(),
  updatedAt: new Date(),
});

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

beforeEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  inventoryStockRepository.countInventoryStocksByStoreProduct = async () => 0;
  storeRepository.findStoreById = async () => buildStore();
  productRepository.findProductById = async () => buildProduct();
  variantRepository.findProductVariantByProductAndId = async () => buildVariant();
});

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
});

test('createStoreProduct creates mapping with calculated final price', async () => {
  storeProductRepository.findStoreProductByStoreAndVariant = async () => null;
  storeProductRepository.findStoreProductByStoreSku = async () => null;
  storeProductRepository.createStoreProduct = async (payload) => ({
    _id: mappingId,
    ...payload,
  } as StoreProductRecord & { _id: Types.ObjectId });

  const created = await createStoreProduct(
    {
      storeId: storeId.toString(),
      productId: productId.toString(),
      variantId: variantId.toString(),
      mrp: 100,
      sellingPrice: 80,
      discountType: 'percentage',
      discountValue: 10,
    },
    actorId,
  );

  assert.equal(created.finalPrice, 72);
});

test('createStoreProduct rejects duplicate store and variant mapping', async () => {
  storeProductRepository.findStoreProductByStoreAndVariant = async () =>
    ({ _id: mappingId } as StoreProductRecord & { _id: Types.ObjectId });

  await assert.rejects(
    () =>
      createStoreProduct(
        {
          storeId: storeId.toString(),
          productId: productId.toString(),
          variantId: variantId.toString(),
          mrp: 100,
          sellingPrice: 80,
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_ALREADY_MAPPED]),
  );
});

test('getStoreProductById returns not found', async () => {
  storeProductRepository.findStoreProductById = async () => null;

  await assert.rejects(
    () => getStoreProductById(mappingId.toString()),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND]),
  );
});

test('deleteStoreProduct soft deletes mapping', async () => {
  storeProductRepository.findStoreProductById = async () =>
    ({
      _id: mappingId,
      storeId,
      vendorId: storeId,
      cityId: storeId,
      productId,
      variantId,
      categoryId: productId,
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
    } as StoreProductRecord & { _id: Types.ObjectId });

  storeProductRepository.softDeleteStoreProductById = async () =>
    ({
      _id: mappingId,
      storeId,
      vendorId: storeId,
      cityId: storeId,
      productId,
      variantId,
      categoryId: productId,
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
      status: 'archived',
      isDeleted: true,
      deletedAt: new Date(),
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as StoreProductRecord & { _id: Types.ObjectId });

  const deleted = await deleteStoreProduct(mappingId.toString(), actorId);

  assert.equal(deleted.id, mappingId.toString());
});
