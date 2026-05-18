import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { writeAuditLog } from '../../audit';
import { STORE_AUDIT_EVENTS } from '../constants/store-audit-events.constant';
import {
  STORE_ERROR_CODES,
  type StoreErrorCode,
} from '../constants/store-error-codes.constant';
import { FULFILLMENT_TYPE_VALUES } from '../constants/fulfillment-type.constant';
import { STORE_STATUS_VALUES } from '../constants/store-status.constant';
import { STORE_TYPE_VALUES } from '../constants/store-type.constant';
import type { StoreRecord } from '../models/store.model';
import {
  createStore as createStoreRecord,
  findNextStoreCode,
  findStoreByCityAndSlug,
  findStoreByCode,
  findStoreById,
  listStores as listStoresRecord,
  softDeleteStoreById,
  updateStoreById,
} from '../repositories/store.repository';
import type { CreateStoreInput, StoreListQuery, UpdateStoreInput } from '../types/store.types';
import { generateStoreSlug, normalizeStoreSlug } from '../utils/store-slug.util';
import { toStoreResponse } from '../utils/store-response.mapper';
import { assertStoreCityAndServiceAreas } from './store-location-reference.service';

const storeError = (code: StoreErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value: string): Types.ObjectId | null =>
  Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const countActiveOrdersByStore = async (storeId: string): Promise<number> => {
  void storeId;
  return 0;
};

const assertVendorObjectId = (vendorId: string) => {
  if (!Types.ObjectId.isValid(vendorId)) {
    throw new AppError({
      message: 'Invalid vendor id',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }
};

const assertStoreStatusAllowed = (status?: string) => {
  if (status === undefined) {
    return;
  }

  if (!STORE_STATUS_VALUES.includes(status as (typeof STORE_STATUS_VALUES)[number])) {
    throw new AppError({
      message: 'Invalid store status',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: storeError(STORE_ERROR_CODES.INVALID_STORE_STATUS),
    });
  }
};

const assertStoreTypeAllowed = (storeType?: string) => {
  if (storeType === undefined) {
    return;
  }

  if (!STORE_TYPE_VALUES.includes(storeType as (typeof STORE_TYPE_VALUES)[number])) {
    throw new AppError({
      message: 'Invalid store type',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: storeError(STORE_ERROR_CODES.INVALID_STORE_TYPE),
    });
  }
};

const assertFulfillmentAllowed = (fulfillmentType?: string) => {
  if (fulfillmentType === undefined) {
    return;
  }

  if (
    !FULFILLMENT_TYPE_VALUES.includes(
      fulfillmentType as (typeof FULFILLMENT_TYPE_VALUES)[number],
    )
  ) {
    throw new AppError({
      message: 'Invalid fulfillment type',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: storeError(STORE_ERROR_CODES.INVALID_FULFILLMENT_TYPE),
    });
  }
};

const resolveSlugForCreate = async (
  cityId: string,
  name: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = normalizeStoreSlug(slug ?? generateStoreSlug(name));

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Store slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findStoreByCityAndSlug(cityId, resolvedSlug);

  if (existing) {
    throw new AppError({
      message: 'Store slug already exists for this city',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeError(STORE_ERROR_CODES.STORE_SLUG_ALREADY_EXISTS),
    });
  }

  return resolvedSlug;
};

const resolveSlugForUpdate = async (
  storeId: string,
  cityId: string,
  name: string,
  currentSlug: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = slug ? normalizeStoreSlug(slug) : currentSlug;

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Store slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findStoreByCityAndSlug(cityId, resolvedSlug, storeId);

  if (existing) {
    throw new AppError({
      message: 'Store slug already exists for this city',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeError(STORE_ERROR_CODES.STORE_SLUG_ALREADY_EXISTS),
    });
  }

  if (!slug && name) {
    return currentSlug;
  }

  return resolvedSlug;
};

const resolveStoreCodeForCreate = async (code?: string): Promise<string> => {
  if (code === undefined || code.trim() === '') {
    return findNextStoreCode();
  }

  const normalized = code.trim().toUpperCase();
  const existing = await findStoreByCode(normalized);

  if (existing) {
    throw new AppError({
      message: 'Store code already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeError(STORE_ERROR_CODES.STORE_CODE_ALREADY_EXISTS),
    });
  }

  return normalized;
};

const assertTemporaryClosureReasonWhenClosed = (
  existing: StoreRecord & { _id: Types.ObjectId },
  input: UpdateStoreInput,
) => {
  const nextOpen = input.isOpen !== undefined ? input.isOpen : existing.isOpen;
  const nextAccept =
    input.isAcceptingOrders !== undefined ? input.isAcceptingOrders : existing.isAcceptingOrders;

  if (!nextOpen || !nextAccept) {
    const reason =
      input.temporaryClosureReason !== undefined
        ? input.temporaryClosureReason?.trim() ?? ''
        : existing.temporaryClosureReason?.trim() ?? '';

    if (!reason) {
      throw new AppError({
        message: 'Temporary closure reason is required when the store is closed',
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        errorCode: storeError(STORE_ERROR_CODES.TEMPORARY_CLOSURE_REASON_REQUIRED),
      });
    }
  }
};

export const listStores = async (query: StoreListQuery) => {
  const response = await listStoresRecord(query);

  return {
    items: response.items.map(toStoreResponse),
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

export const getStoreById = async (storeId: string) => {
  const store = await findStoreById(storeId);

  if (!store) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeError(STORE_ERROR_CODES.STORE_NOT_FOUND),
    });
  }

  return toStoreResponse(store);
};

export const createStore = async (input: CreateStoreInput, actorUserId: string) => {
  assertVendorObjectId(input.vendorId);
  assertStoreStatusAllowed(input.status);
  assertStoreTypeAllowed(input.storeType);
  assertFulfillmentAllowed(input.fulfillmentType);

  const serviceAreaIds = input.serviceAreaIds ?? [];
  await assertStoreCityAndServiceAreas(input.cityId, serviceAreaIds);

  const nextOpen = input.isOpen ?? true;
  const nextAccept = input.isAcceptingOrders ?? true;

  if (!nextOpen || !nextAccept) {
    const reason = input.temporaryClosureReason?.trim() ?? '';
    if (!reason) {
      throw new AppError({
        message: 'Temporary closure reason is required when the store is closed',
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        errorCode: storeError(STORE_ERROR_CODES.TEMPORARY_CLOSURE_REASON_REQUIRED),
      });
    }
  }

  const slug = await resolveSlugForCreate(input.cityId, input.name, input.slug);
  const code = await resolveStoreCodeForCreate(input.code);
  const actorId = toObjectIdOrNull(actorUserId);

  const created = await createStoreRecord({
    vendorId: new Types.ObjectId(input.vendorId),
    cityId: new Types.ObjectId(input.cityId),
    serviceAreaIds: serviceAreaIds.map((id) => new Types.ObjectId(id)),
    name: input.name.trim(),
    slug,
    code,
    description: input.description ?? null,
    phone: input.phone.trim(),
    email: input.email?.trim() ?? null,
    addressLine1: input.addressLine1.trim(),
    addressLine2: input.addressLine2?.trim() ?? null,
    landmark: input.landmark?.trim() ?? null,
    pincode: input.pincode.trim(),
    latitude: input.latitude,
    longitude: input.longitude,
    serviceRadiusKm: input.serviceRadiusKm,
    openingTime: input.openingTime.trim(),
    closingTime: input.closingTime.trim(),
    operatingDays: input.operatingDays,
    isOpen: nextOpen,
    isAcceptingOrders: nextAccept,
    temporaryClosureReason: input.temporaryClosureReason?.trim() ?? null,
    storeType: input.storeType,
    fulfillmentType: input.fulfillmentType,
    status: input.status ?? 'active',
    createdBy: actorId,
    updatedBy: actorId,
  });

  await writeAuditLog({
    eventType: STORE_AUDIT_EVENTS.STORE_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store',
    entityId: created._id,
    vendorId: created.vendorId,
    storeId: created._id,
    cityId: created.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      storeId: created._id.toString(),
      cityId: created.cityId.toString(),
      code: created.code,
      slug: created.slug,
    },
    status: 'success',
  });

  return toStoreResponse(created);
};

export const updateStore = async (storeId: string, input: UpdateStoreInput, actorUserId: string) => {
  const existing = await findStoreById(storeId);

  if (!existing) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeError(STORE_ERROR_CODES.STORE_NOT_FOUND),
    });
  }

  if (input.code !== undefined) {
    throw new AppError({
      message: 'Store code cannot be changed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeError(STORE_ERROR_CODES.STORE_CODE_IMMUTABLE),
    });
  }

  if (input.vendorId !== undefined) {
    assertVendorObjectId(input.vendorId);
  }

  assertStoreStatusAllowed(input.status);
  assertStoreTypeAllowed(input.storeType);
  assertFulfillmentAllowed(input.fulfillmentType);

  let nextCityId = existing.cityId.toString();
  if (input.cityId !== undefined) {
    nextCityId = input.cityId;
  }

  const nextServiceAreaIds =
    input.serviceAreaIds !== undefined
      ? input.serviceAreaIds
      : existing.serviceAreaIds.map((id) => id.toString());

  if (input.cityId !== undefined || input.serviceAreaIds !== undefined) {
    await assertStoreCityAndServiceAreas(nextCityId, nextServiceAreaIds);
  }

  assertTemporaryClosureReasonWhenClosed(existing, input);

  const slug = await resolveSlugForUpdate(
    storeId,
    nextCityId,
    input.name ?? existing.name,
    existing.slug,
    input.slug,
  );

  const actorId = toObjectIdOrNull(actorUserId);

  const updatePayload: Partial<StoreRecord> = {
    ...(input.vendorId !== undefined ? { vendorId: new Types.ObjectId(input.vendorId) } : {}),
    ...(input.cityId !== undefined ? { cityId: new Types.ObjectId(input.cityId) } : {}),
    ...(input.serviceAreaIds !== undefined
      ? { serviceAreaIds: input.serviceAreaIds.map((id) => new Types.ObjectId(id)) }
      : {}),
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    slug,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.phone !== undefined ? { phone: input.phone.trim() } : {}),
    ...(input.email !== undefined ? { email: input.email?.trim() ?? null } : {}),
    ...(input.addressLine1 !== undefined ? { addressLine1: input.addressLine1.trim() } : {}),
    ...(input.addressLine2 !== undefined ? { addressLine2: input.addressLine2?.trim() ?? null } : {}),
    ...(input.landmark !== undefined ? { landmark: input.landmark?.trim() ?? null } : {}),
    ...(input.pincode !== undefined ? { pincode: input.pincode.trim() } : {}),
    ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
    ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
    ...(input.serviceRadiusKm !== undefined ? { serviceRadiusKm: input.serviceRadiusKm } : {}),
    ...(input.openingTime !== undefined ? { openingTime: input.openingTime.trim() } : {}),
    ...(input.closingTime !== undefined ? { closingTime: input.closingTime.trim() } : {}),
    ...(input.operatingDays !== undefined ? { operatingDays: input.operatingDays } : {}),
    ...(input.isOpen !== undefined ? { isOpen: input.isOpen } : {}),
    ...(input.isAcceptingOrders !== undefined ? { isAcceptingOrders: input.isAcceptingOrders } : {}),
    ...(input.temporaryClosureReason !== undefined
      ? { temporaryClosureReason: input.temporaryClosureReason?.trim() ?? null }
      : {}),
    ...(input.storeType !== undefined ? { storeType: input.storeType } : {}),
    ...(input.fulfillmentType !== undefined ? { fulfillmentType: input.fulfillmentType } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedBy: actorId,
  };

  const updated = await updateStoreById(storeId, updatePayload);

  if (!updated) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeError(STORE_ERROR_CODES.STORE_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: STORE_AUDIT_EVENTS.STORE_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store',
    entityId: updated._id,
    vendorId: updated.vendorId,
    storeId: updated._id,
    cityId: updated.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      storeId: updated._id.toString(),
      changedFields: Object.keys(input),
    },
    status: 'success',
  });

  if (existing.isOpen !== updated.isOpen) {
    await writeAuditLog({
      eventType: STORE_AUDIT_EVENTS.STORE_OPEN_STATUS_CHANGED,
      actorId,
      actorRole: null,
      actorSurface: 'admin_dashboard',
      entityType: 'store',
      entityId: updated._id,
      vendorId: updated.vendorId,
      storeId: updated._id,
      cityId: updated.cityId,
      requestId: null,
      traceId: null,
      ipAddress: null,
      userAgent: null,
      metadata: {
        storeId: updated._id.toString(),
        previous: existing.isOpen,
        next: updated.isOpen,
      },
      status: 'success',
    });
  }

  if (existing.isAcceptingOrders !== updated.isAcceptingOrders) {
    await writeAuditLog({
      eventType: STORE_AUDIT_EVENTS.STORE_ORDER_ACCEPTANCE_CHANGED,
      actorId,
      actorRole: null,
      actorSurface: 'admin_dashboard',
      entityType: 'store',
      entityId: updated._id,
      vendorId: updated.vendorId,
      storeId: updated._id,
      cityId: updated.cityId,
      requestId: null,
      traceId: null,
      ipAddress: null,
      userAgent: null,
      metadata: {
        storeId: updated._id.toString(),
        previous: existing.isAcceptingOrders,
        next: updated.isAcceptingOrders,
      },
      status: 'success',
    });
  }

  return toStoreResponse(updated);
};

export const deleteStore = async (storeId: string, actorUserId: string) => {
  const existing = await findStoreById(storeId);

  if (!existing) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeError(STORE_ERROR_CODES.STORE_NOT_FOUND),
    });
  }

  const orderCount = await countActiveOrdersByStore(storeId);

  if (orderCount > 0) {
    throw new AppError({
      message: 'Store has active orders and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: storeError(STORE_ERROR_CODES.STORE_HAS_ACTIVE_ORDERS),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);

  const deleted = await softDeleteStoreById(storeId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Store not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: storeError(STORE_ERROR_CODES.STORE_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: STORE_AUDIT_EVENTS.STORE_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'store',
    entityId: deleted._id,
    vendorId: deleted.vendorId,
    storeId: deleted._id,
    cityId: deleted.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      storeId: deleted._id.toString(),
    },
    status: 'success',
  });

  return toStoreResponse(deleted);
};

export { countActiveOrdersByStore };
