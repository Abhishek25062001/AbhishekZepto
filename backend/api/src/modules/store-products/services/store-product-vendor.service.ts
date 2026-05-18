import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { writeAuditLog } from '../../audit';
import { STORE_PRODUCT_AUDIT_EVENTS } from '../constants/store-product-audit-events.constant';
import {
  STORE_PRODUCT_ERROR_CODES,
  type StoreProductErrorCode,
} from '../constants/store-product-error-codes.constant';
import {
  findStoreProductById,
  listStoreProducts as listStoreProductsRecord,
  updateStoreProductById,
} from '../repositories/store-product.repository';
import type {
  StoreProductListQuery,
  VendorUpdateStoreProductAvailabilityInput,
  VendorUpdateStoreProductPriceInput,
} from '../types/store-product.types';
import { calculateFinalPrice } from '../utils/store-product-price.util';
import { toStoreProductResponse } from '../utils/store-product-response.mapper';

const storeProductError = (code: StoreProductErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value: string): Types.ObjectId | null =>
  Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

export type VendorStoreProductScope = {
  vendorId: string | null;
  storeId: string | null;
};

const assertVendorScope = (
  mapping: { vendorId: Types.ObjectId; storeId: Types.ObjectId },
  scope: VendorStoreProductScope,
) => {
  if (scope.vendorId && mapping.vendorId.toString() !== scope.vendorId) {
    throw new AppError({
      message: 'Store product mapping is outside vendor scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_SCOPE_DENIED),
    });
  }

  if (scope.storeId && mapping.storeId.toString() !== scope.storeId) {
    throw new AppError({
      message: 'Store product mapping is outside store scope',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_SCOPE_DENIED),
    });
  }
};

export const listVendorStoreProducts = async (
  query: StoreProductListQuery,
  scope: VendorStoreProductScope,
) => {
  const scopedQuery: StoreProductListQuery = { ...query };

  if (scope.storeId) {
    scopedQuery.storeId = scope.storeId;
  }

  if (scope.vendorId) {
    scopedQuery.vendorId = scope.vendorId;
  }

  const response = await listStoreProductsRecord(scopedQuery);

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

export const getVendorStoreProductById = async (
  storeProductId: string,
  scope: VendorStoreProductScope,
) => {
  const mapping = await findStoreProductById(storeProductId);

  if (!mapping) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  assertVendorScope(mapping, scope);

  return toStoreProductResponse(mapping);
};

export const updateVendorStoreProductAvailability = async (
  storeProductId: string,
  input: VendorUpdateStoreProductAvailabilityInput,
  actorUserId: string,
  scope: VendorStoreProductScope,
) => {
  const existing = await findStoreProductById(storeProductId);

  if (!existing) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  assertVendorScope(existing, scope);

  const actorId = toObjectIdOrNull(actorUserId);
  const now = new Date();

  const updated = await updateStoreProductById(storeProductId, {
    ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
    ...(input.isVisible !== undefined ? { isVisible: input.isVisible } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    availabilityUpdatedAt: now,
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
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_VENDOR_AVAILABILITY_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'vendor_panel',
    entityType: 'store_product',
    entityId: updated._id,
    vendorId: updated.vendorId,
    storeId: updated.storeId,
    cityId: updated.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { storeProductId: updated._id.toString() },
    status: 'success',
  });

  return toStoreProductResponse(updated);
};

export const updateVendorStoreProductPrice = async (
  storeProductId: string,
  input: VendorUpdateStoreProductPriceInput,
  actorUserId: string,
  scope: VendorStoreProductScope,
) => {
  const existing = await findStoreProductById(storeProductId);

  if (!existing) {
    throw new AppError({
      message: 'Store product mapping not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_NOT_FOUND),
    });
  }

  assertVendorScope(existing, scope);

  if (existing.isPriceLocked) {
    throw new AppError({
      message: 'Store product price is locked',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeProductError(STORE_PRODUCT_ERROR_CODES.STORE_PRODUCT_PRICE_LOCKED),
    });
  }

  const mrp = input.mrp ?? existing.mrp;
  const sellingPrice = input.sellingPrice ?? existing.sellingPrice;
  const discountType = input.discountType ?? existing.discountType;
  const discountValue = input.discountValue ?? existing.discountValue;
  const finalPrice = calculateFinalPrice(mrp, sellingPrice, discountType, discountValue);
  const actorId = toObjectIdOrNull(actorUserId);
  const now = new Date();

  const updated = await updateStoreProductById(storeProductId, {
    mrp,
    sellingPrice,
    discountType,
    discountValue,
    finalPrice,
    priceUpdatedAt: now,
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
    eventType: STORE_PRODUCT_AUDIT_EVENTS.STORE_PRODUCT_VENDOR_PRICE_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'vendor_panel',
    entityType: 'store_product',
    entityId: updated._id,
    vendorId: updated.vendorId,
    storeId: updated.storeId,
    cityId: updated.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: { storeProductId: updated._id.toString() },
    status: 'success',
  });

  return toStoreProductResponse(updated);
};
