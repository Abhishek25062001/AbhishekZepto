import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { writeAuditLog } from '../../audit';
import { STORE_PRODUCT_AUDIT_EVENTS } from '../constants/store-product-audit-events.constant';
import { STORE_PRODUCT_BULK_DUPLICATE_MODE } from '../constants/store-product-bulk-duplicate-mode.constant';
import { STORE_PRODUCT_DISCOUNT_TYPE } from '../constants/store-product-discount-type.constant';
import {
  STORE_PRODUCT_ERROR_CODES,
  type StoreProductErrorCode,
} from '../constants/store-product-error-codes.constant';
import { STORE_PRODUCT_STATUS } from '../constants/store-product-status.constant';
import type { StoreProductRecord } from '../models/store-product.model';
import {
  bulkCreateStoreProducts,
  bulkUpdateStoreProductVisibility as bulkUpdateStoreProductVisibilityRecords,
  createStoreProduct as createStoreProductRecord,
  findStoreProductById,
  findStoreProductByStoreAndVariant,
  findStoreProductByStoreSku,
  listStoreProducts as listStoreProductsRecord,
  softDeleteStoreProductById,
  updateStoreProductById,
} from '../repositories/store-product.repository';
import type {
  BulkMapStoreProductsInput,
  BulkUpdateStoreProductPriceInput,
  BulkUpdateStoreProductVisibilityInput,
  CreateStoreProductInput,
  StoreProductListQuery,
  UpdateStoreProductInput,
} from '../types/store-product.types';
import { calculateFinalPrice } from '../utils/store-product-price.util';
import { toStoreProductResponse } from '../utils/store-product-response.mapper';
import { countInventoryStocksByStoreProduct } from '../../inventory/repositories/inventory-stock.repository';
import { assertStoreProductReferences } from './store-product-reference.service';

const storeProductError = (code: StoreProductErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value: string): Types.ObjectId | null =>
  Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const buildPriceFields = (
  mrp: number,
  sellingPrice: number,
  discountType: StoreProductRecord['discountType'],
  discountValue: number,
) => {
  const finalPrice = calculateFinalPrice(mrp, sellingPrice, discountType, discountValue);
  return { mrp, sellingPrice, discountType, discountValue, finalPrice };
};

export const listStoreProducts = async (query: StoreProductListQuery) => {
  const response = await listStoreProductsRecord(query);

  return {
    items: response.items.map(toStoreProductResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: response.total,
      totalPages: Math.max(1, Math.ceil(response.total / query.limit)),
      hasNextPage: query.page * query.limit < response.total,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const getStoreProductById = async (storeProductId: string) => {
  const mapping = await findStoreProductById(storeProductId);

  if (!mapping) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  return toStoreProductResponse(mapping);
};

export const createStoreProduct = async (input: CreateStoreProductInput, actorUserId: string) => {
  const refs = await assertStoreProductReferences(input.storeId, input.productId, input.variantId);

  const duplicate = await findStoreProductByStoreAndVariant(input.storeId, input.variantId);

  if (duplicate) {
    throw new AppError({
      message: 'Store product mapping already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_ALREADY_MAPPED),
    });
  }

  if (input.storeSku?.trim()) {
    const duplicateSku = await findStoreProductByStoreSku(input.storeId, input.storeSku);

    if (duplicateSku) {
      throw new AppError({
        message: 'Store SKU already exists for this store',
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_SKU_ALREADY_EXISTS),
      });
    }
  }

  const discountType = input.discountType ?? STORE_PRODUCT_DISCOUNT_TYPE.NONE;
  const discountValue = input.discountValue ?? 0;
  const priceFields = buildPriceFields(input.mrp, input.sellingPrice, discountType, discountValue);
  const now = new Date();
  const actorId = toObjectIdOrNull(actorUserId);

  const created = await createStoreProductRecord({
    storeId: new Types.ObjectId(input.storeId),
    productId: new Types.ObjectId(input.productId),
    variantId: new Types.ObjectId(input.variantId),
    vendorId: refs.denormalized.vendorId,
    cityId: refs.denormalized.cityId,
    categoryId: refs.denormalized.categoryId,
    brandId: refs.denormalized.brandId,
    sku: refs.denormalized.sku,
    storeSku: input.storeSku?.trim() ?? null,
    taxCategoryId: refs.denormalized.taxCategoryId,
    ...priceFields,
    isAvailable: input.isAvailable ?? true,
    isVisible: input.isVisible ?? true,
    isFeatured: input.isFeatured ?? false,
    isPriceLocked: input.isPriceLocked ?? false,
    status: input.status ?? STORE_PRODUCT_STATUS.ACTIVE,
    priceUpdatedAt: now,
    availabilityUpdatedAt: now,
    createdBy: actorId,
    updatedBy: actorId,
  });

  await writeAuditLog({
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store_product',
    entityId: created._id,
    vendorId: created.vendorId,
    storeId: created.storeId,
    cityId: created.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      storeProductId: created._id.toString(),
      storeId: created.storeId.toString(),
      variantId: created.variantId.toString(),
    },
    status: 'success',
  });

  return toStoreProductResponse(created);
};

export const updateStoreProduct = async (
  storeProductId: string,
  input: UpdateStoreProductInput,
  actorUserId: string,
) => {
  const existing = await findStoreProductById(storeProductId);

  if (!existing) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  if (input.storeSku !== undefined && input.storeSku?.trim()) {
    const duplicateSku = await findStoreProductByStoreSku(
      existing.storeId.toString(),
      input.storeSku,
      storeProductId,
    );

    if (duplicateSku) {
      throw new AppError({
        message: 'Store SKU already exists for this store',
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_SKU_ALREADY_EXISTS),
      });
    }
  }

  const mrp = input.mrp ?? existing.mrp;
  const sellingPrice = input.sellingPrice ?? existing.sellingPrice;
  const discountType = input.discountType ?? existing.discountType;
  const discountValue = input.discountValue ?? existing.discountValue;
  const priceChanged =
    input.mrp !== undefined ||
    input.sellingPrice !== undefined ||
    input.discountType !== undefined ||
    input.discountValue !== undefined;

  const availabilityChanged =
    input.isAvailable !== undefined ||
    input.isVisible !== undefined ||
    input.isFeatured !== undefined ||
    input.status !== undefined;

  const priceFields = priceChanged
    ? buildPriceFields(mrp, sellingPrice, discountType, discountValue)
    : {};

  const now = new Date();
  const actorId = toObjectIdOrNull(actorUserId);

  const updated = await updateStoreProductById(storeProductId, {
    ...(input.storeSku !== undefined ? { storeSku: input.storeSku?.trim() ?? null } : {}),
    ...priceFields,
    ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
    ...(input.isVisible !== undefined ? { isVisible: input.isVisible } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
    ...(input.isPriceLocked !== undefined ? { isPriceLocked: input.isPriceLocked } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(priceChanged ? { priceUpdatedAt: now } : {}),
    ...(availabilityChanged ? { availabilityUpdatedAt: now } : {}),
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store_product',
    entityId: updated._id,
    vendorId: updated.vendorId,
    storeId: updated.storeId,
    cityId: updated.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      storeProductId: updated._id.toString(),
      changedFields: Object.keys(input),
    },
    status: 'success',
  });

  return toStoreProductResponse(updated);
};

export const deleteStoreProduct = async (storeProductId: string, actorUserId: string) => {
  const existing = await findStoreProductById(storeProductId);

  if (!existing) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  const inventoryStockCount = await countInventoryStocksByStoreProduct(storeProductId);

  if (inventoryStockCount > 0) {
    throw new AppError({
      message: 'Store product has inventory stock and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_HAS_INVENTORY_STOCK),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);
  const deleted = await softDeleteStoreProductById(storeProductId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store_product',
    entityId: deleted._id,
    vendorId: deleted.vendorId,
    storeId: deleted.storeId,
    cityId: deleted.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { storeProductId: deleted._id.toString() },
    status: 'success',
  });

  return toStoreProductResponse(deleted);
};

export const bulkMapStoreProducts = async (
  input: BulkMapStoreProductsInput,
  actorUserId: string,
) => {
  const duplicateMode = input.duplicateMode ?? STORE_PRODUCT_BULK_DUPLICATE_MODE.FAIL;
  const actorId = toObjectIdOrNull(actorUserId);
  const result = {
    created: 0,
    skipped: 0,
    failed: 0,
    errors: [] as Array<{ index: number; message: string; code?: string }>,
  };

  const recordsToCreate: Partial<StoreProductRecord>[] = [];

  for (const [index, item] of input.items.entries()) {

    try {
      const refs = await assertStoreProductReferences(input.storeId, item.productId, item.variantId);
      const existing = await findStoreProductByStoreAndVariant(input.storeId, item.variantId);

      if (existing) {
        if (duplicateMode === STORE_PRODUCT_BULK_DUPLICATE_MODE.SKIP) {
          result.skipped += 1;
          continue;
        }

        if (duplicateMode === STORE_PRODUCT_BULK_DUPLICATE_MODE.FAIL) {
          throw new AppError({
            message: 'Store product mapping already exists',
            statusCode: HTTP_STATUS.CONFLICT,
            errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_ALREADY_MAPPED),
          });
        }

        if (duplicateMode === STORE_PRODUCT_BULK_DUPLICATE_MODE.REPLACE) {
          await softDeleteStoreProductById(existing._id.toString(), actorId);
        }
      }

      if (item.storeSku?.trim()) {
        const duplicateSku = await findStoreProductByStoreSku(input.storeId, item.storeSku);

        if (duplicateSku) {
          throw new AppError({
            message: 'Store SKU already exists',
            statusCode: HTTP_STATUS.CONFLICT,
            errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_SKU_ALREADY_EXISTS),
          });
        }
      }

      const discountType = item.discountType ?? STORE_PRODUCT_DISCOUNT_TYPE.NONE;
      const discountValue = item.discountValue ?? 0;
      const priceFields = buildPriceFields(item.mrp, item.sellingPrice, discountType, discountValue);
      const now = new Date();

      recordsToCreate.push({
        storeId: new Types.ObjectId(input.storeId),
        productId: new Types.ObjectId(item.productId),
        variantId: new Types.ObjectId(item.variantId),
        vendorId: refs.denormalized.vendorId,
        cityId: refs.denormalized.cityId,
        categoryId: refs.denormalized.categoryId,
        brandId: refs.denormalized.brandId,
        sku: refs.denormalized.sku,
        storeSku: item.storeSku?.trim() ?? null,
        taxCategoryId: refs.denormalized.taxCategoryId,
        ...priceFields,
        isAvailable: item.isAvailable ?? true,
        isVisible: item.isVisible ?? true,
        isFeatured: item.isFeatured ?? false,
        isPriceLocked: false,
        status: STORE_PRODUCT_STATUS.ACTIVE,
        priceUpdatedAt: now,
        availabilityUpdatedAt: now,
        createdBy: actorId,
        updatedBy: actorId,
      });
    } catch (error) {
      result.failed += 1;
      result.errors.push({
        index,
        message: error instanceof Error ? error.message : 'Bulk map item failed',
        code: error instanceof AppError ? error.errorCode : undefined,
      });
    }
  }

  if (recordsToCreate.length > 0) {
    await bulkCreateStoreProducts(recordsToCreate);
    result.created = recordsToCreate.length;
  }

  await writeAuditLog({
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_BULK_MAPPED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store_product',
    entityId: null,
    vendorId: null,
    storeId: new Types.ObjectId(input.storeId),
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      created: result.created,
      skipped: result.skipped,
      failed: result.failed,
    },
    status: 'success',
  });

  return result;
};

export const bulkUpdateStoreProductPrices = async (
  input: BulkUpdateStoreProductPriceInput,
  actorUserId: string,
) => {
  const actorId = toObjectIdOrNull(actorUserId);
  const now = new Date();
  let affected = 0;

  for (const storeProductId of input.storeProductIds) {
    const existing = await findStoreProductById(storeProductId);

    if (!existing) {
      continue;
    }

    const mrp = input.mrp ?? existing.mrp;
    const sellingPrice = input.sellingPrice ?? existing.sellingPrice;
    const discountType = input.discountType ?? existing.discountType;
    const discountValue = input.discountValue ?? existing.discountValue;
    const priceFields = buildPriceFields(mrp, sellingPrice, discountType, discountValue);

    const updated = await updateStoreProductById(storeProductId, {
      ...priceFields,
      priceUpdatedAt: now,
      updatedBy: actorId,
    });

    if (updated) {
      affected += 1;
    }
  }

  await writeAuditLog({
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_BULK_PRICE_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store_product',
    entityId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { affected },
    status: 'success',
  });

  return { affected };
};

export const bulkUpdateStoreProductVisibility = async (
  input: BulkUpdateStoreProductVisibilityInput,
  actorUserId: string,
) => {
  const actorId = toObjectIdOrNull(actorUserId);
  const now = new Date();

  const affected = await bulkUpdateStoreProductVisibilityRecords(
    input.storeProductIds,
    {
      ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
      ...(input.isVisible !== undefined ? { isVisible: input.isVisible } : {}),
      ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      availabilityUpdatedAt: now,
      updatedBy: actorId,
    },
  );

  await writeAuditLog({
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_BULK_VISIBILITY_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store_product',
    entityId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { affected },
    status: 'success',
  });

  return { affected };
};
