import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { SERVICE_AREA_AUDIT_EVENTS } from '../constants/service-area-audit-events.constant';
import {
  SERVICE_AREA_ERROR_CODES,
  type ServiceAreaErrorCode,
} from '../constants/service-area-error-codes.constant';
import {
  SERVICE_AREA_STATUS,
  SERVICE_AREA_STATUS_VALUES,
} from '../constants/service-area-status.constant';
import type { ServiceAreaRecord } from '../models/service-area.model';
import {
  createServiceArea as createServiceAreaRecord,
  findServiceAreaByCityAndSlug,
  findServiceAreaById,
  listServiceAreas as listServiceAreasRecord,
  softDeleteServiceAreaById,
  updateServiceAreaById,
} from '../repositories/service-area.repository';
import type {
  CreateServiceAreaInput,
  ServiceAreaListQuery,
  UpdateServiceAreaInput,
} from '../types/service-area.types';
import {
  generateServiceAreaSlug,
  normalizeServiceAreaSlug,
} from '../utils/service-area-slug.util';
import { toServiceAreaResponse } from '../utils/service-area-response.mapper';
import { assertCityEligibleForServiceArea } from './service-area-city-reference.service';
import { countActiveStoresByServiceArea } from '../../../stores/repositories/store.repository';

const serviceAreaError = (code: ServiceAreaErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value: string): Types.ObjectId | null =>
  Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const assertServiceAreaStatusAllowed = (status?: string) => {
  if (status === undefined) {
    return;
  }

  if (
    !SERVICE_AREA_STATUS_VALUES.includes(status as (typeof SERVICE_AREA_STATUS_VALUES)[number])
  ) {
    throw new AppError({
      message: 'Invalid service area status',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.INVALID_SERVICE_AREA_STATUS),
    });
  }
};

const resolveSlugForCreate = async (
  cityId: string,
  name: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = normalizeServiceAreaSlug(slug ?? generateServiceAreaSlug(name));

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Service area slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findServiceAreaByCityAndSlug(cityId, resolvedSlug);

  if (existing) {
    throw new AppError({
      message: 'Service area slug already exists for this city',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_SLUG_ALREADY_EXISTS),
    });
  }

  return resolvedSlug;
};

const resolveSlugForUpdate = async (
  serviceAreaId: string,
  cityId: string,
  name: string,
  currentSlug: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = slug ? normalizeServiceAreaSlug(slug) : currentSlug;

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Service area slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findServiceAreaByCityAndSlug(cityId, resolvedSlug, serviceAreaId);

  if (existing) {
    throw new AppError({
      message: 'Service area slug already exists for this city',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_SLUG_ALREADY_EXISTS),
    });
  }

  if (!slug && name) {
    return currentSlug;
  }

  return resolvedSlug;
};

export const listServiceAreas = async (query: ServiceAreaListQuery) => {
  const response = await listServiceAreasRecord(query);

  return {
    items: response.items.map(toServiceAreaResponse),
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

export const getServiceAreaById = async (serviceAreaId: string) => {
  const row = await findServiceAreaById(serviceAreaId);

  if (!row) {
    throw new AppError({
      message: 'Service area not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_NOT_FOUND),
    });
  }

  return toServiceAreaResponse(row);
};

export const createServiceArea = async (
  input: CreateServiceAreaInput,
  actorUserId: string,
) => {
  await assertCityEligibleForServiceArea(input.cityId);
  assertServiceAreaStatusAllowed(input.status);

  const slug = await resolveSlugForCreate(input.cityId, input.name, input.slug);
  const actorId = toObjectIdOrNull(actorUserId);

  const created = await createServiceAreaRecord({
    cityId: new Types.ObjectId(input.cityId),
    name: input.name.trim(),
    slug,
    description: input.description ?? null,
    polygon: input.polygon ?? null,
    centerLatitude: input.centerLatitude ?? null,
    centerLongitude: input.centerLongitude ?? null,
    radiusKm: input.radiusKm ?? null,
    isServiceable: input.isServiceable ?? true,
    status: input.status ?? SERVICE_AREA_STATUS.ACTIVE,
    createdBy: actorId,
    updatedBy: actorId,
  });

  await writeAuditLog({
    eventType: SERVICE_AREA_AUDIT_EVENTS.SERVICE_AREA_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'service_area',
    entityId: created._id,
    vendorId: null,
    storeId: null,
    cityId: created.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      serviceAreaId: created._id.toString(),
      cityId: created.cityId.toString(),
      slug: created.slug,
    },
    status: 'success',
  });

  return toServiceAreaResponse(created);
};

export const updateServiceArea = async (
  serviceAreaId: string,
  input: UpdateServiceAreaInput,
  actorUserId: string,
) => {
  const existing = await findServiceAreaById(serviceAreaId);

  if (!existing) {
    throw new AppError({
      message: 'Service area not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_NOT_FOUND),
    });
  }

  assertServiceAreaStatusAllowed(input.status);

  let nextCityId = existing.cityId.toString();
  if (input.cityId !== undefined && input.cityId !== nextCityId) {
    await assertCityEligibleForServiceArea(input.cityId);
    nextCityId = input.cityId;
  }

  const slug = await resolveSlugForUpdate(
    serviceAreaId,
    nextCityId,
    input.name ?? existing.name,
    existing.slug,
    input.slug,
  );

  const actorId = toObjectIdOrNull(actorUserId);

  const updatePayload: Partial<ServiceAreaRecord> = {
    ...(input.cityId !== undefined ? { cityId: new Types.ObjectId(input.cityId) } : {}),
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    slug,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.polygon !== undefined ? { polygon: input.polygon } : {}),
    ...(input.centerLatitude !== undefined ? { centerLatitude: input.centerLatitude } : {}),
    ...(input.centerLongitude !== undefined ? { centerLongitude: input.centerLongitude } : {}),
    ...(input.radiusKm !== undefined ? { radiusKm: input.radiusKm } : {}),
    ...(input.isServiceable !== undefined ? { isServiceable: input.isServiceable } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedBy: actorId,
  };

  const updated = await updateServiceAreaById(serviceAreaId, updatePayload);

  if (!updated) {
    throw new AppError({
      message: 'Service area not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: SERVICE_AREA_AUDIT_EVENTS.SERVICE_AREA_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'service_area',
    entityId: updated._id,
    vendorId: null,
    storeId: null,
    cityId: updated.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      serviceAreaId: updated._id.toString(),
      cityId: updated.cityId.toString(),
    },
    status: 'success',
  });

  return toServiceAreaResponse(updated);
};

export const deleteServiceArea = async (serviceAreaId: string, actorUserId: string) => {
  const existing = await findServiceAreaById(serviceAreaId);

  if (!existing) {
    throw new AppError({
      message: 'Service area not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_NOT_FOUND),
    });
  }

  const storeCount = await countActiveStoresByServiceArea(serviceAreaId);

  if (storeCount > 0) {
    throw new AppError({
      message: 'Service area has active stores and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_HAS_ACTIVE_STORES),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);

  const deleted = await softDeleteServiceAreaById(serviceAreaId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Service area not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: serviceAreaError(SERVICE_AREA_ERROR_CODES.SERVICE_AREA_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: SERVICE_AREA_AUDIT_EVENTS.SERVICE_AREA_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'service_area',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: deleted.cityId,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      serviceAreaId: deleted._id.toString(),
      cityId: deleted.cityId.toString(),
    },
    status: 'success',
  });

  return toServiceAreaResponse(deleted);
};
