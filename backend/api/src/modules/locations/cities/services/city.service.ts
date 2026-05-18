import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { CITY_AUDIT_EVENTS } from '../constants/city-audit-events.constant';
import { CITY_ERROR_CODES, type CityErrorCode } from '../constants/city-error-codes.constant';
import { CITY_STATUS_VALUES } from '../constants/city-status.constant';
import {
  createCity as createCityRecord,
  findCityById,
  findCityBySlug,
  listCities as listCitiesRecord,
  softDeleteCityById,
  updateCityById,
} from '../repositories/city.repository';
import type { CityListQuery, CreateCityInput, UpdateCityInput } from '../types/city.types';
import { generateCitySlug, normalizeCitySlug } from '../utils/city-slug.util';
import { toCityResponse } from '../utils/city-response.mapper';
import { countActiveServiceAreasByCity } from '../../service-areas/repositories/service-area.repository';
import { countActiveStoresByCity } from '../../../stores/repositories/store.repository';

const cityError = (code: CityErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value: string): Types.ObjectId | null =>
  Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const assertCityStatusAllowed = (status?: string) => {
  if (status === undefined) {
    return;
  }

  if (!CITY_STATUS_VALUES.includes(status as (typeof CITY_STATUS_VALUES)[number])) {
    throw new AppError({
      message: 'Invalid city status',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: cityError(CITY_ERROR_CODES.INVALID_CITY_STATUS),
    });
  }
};

const resolveSlugForCreate = async (name: string, slug?: string): Promise<string> => {
  const resolvedSlug = normalizeCitySlug(slug ?? generateCitySlug(name));

  if (!resolvedSlug) {
    throw new AppError({
      message: 'City slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findCityBySlug(resolvedSlug);

  if (existing) {
    throw new AppError({
      message: 'City slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: cityError(CITY_ERROR_CODES.CITY_SLUG_ALREADY_EXISTS),
    });
  }

  return resolvedSlug;
};

const resolveSlugForUpdate = async (
  cityId: string,
  name: string,
  currentSlug: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = slug ? normalizeCitySlug(slug) : currentSlug;

  if (!resolvedSlug) {
    throw new AppError({
      message: 'City slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findCityBySlug(resolvedSlug, cityId);

  if (existing) {
    throw new AppError({
      message: 'City slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: cityError(CITY_ERROR_CODES.CITY_SLUG_ALREADY_EXISTS),
    });
  }

  if (!slug && name) {
    return currentSlug;
  }

  return resolvedSlug;
};

export const listCities = async (query: CityListQuery) => {
  const response = await listCitiesRecord(query);

  return {
    items: response.items.map(toCityResponse),
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

export const getCityById = async (cityId: string) => {
  const city = await findCityById(cityId);

  if (!city) {
    throw new AppError({
      message: 'City not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: cityError(CITY_ERROR_CODES.CITY_NOT_FOUND),
    });
  }

  return toCityResponse(city);
};

export const createCity = async (input: CreateCityInput, actorUserId: string) => {
  assertCityStatusAllowed(input.status);

  const slug = await resolveSlugForCreate(input.name, input.slug);
  const actorId = toObjectIdOrNull(actorUserId);

  let country: string;
  if (input.country === undefined) {
    country = 'India';
  } else {
    country = input.country.trim();
    if (!country) {
      throw new AppError({
        message: 'Country is required',
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        errorCode: ERROR_CODES.VALIDATION_ERROR,
      });
    }
  }

  const created = await createCityRecord({
    name: input.name.trim(),
    slug,
    state: input.state.trim(),
    country,
    timezone: input.timezone.trim(),
    currencyCode: input.currencyCode.trim().toUpperCase(),
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    serviceRadiusKm: input.serviceRadiusKm ?? null,
    isServiceable: input.isServiceable ?? true,
    status: input.status ?? 'active',
    createdBy: actorId,
    updatedBy: actorId,
  });

  await writeAuditLog({
    eventType: CITY_AUDIT_EVENTS.CITY_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'city',
    entityId: created._id,
    vendorId: null,
    storeId: null,
    cityId: created._id,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      cityId: created._id.toString(),
      slug: created.slug,
    },
    status: 'success',
  });

  return toCityResponse(created);
};

export const updateCity = async (cityId: string, input: UpdateCityInput, actorUserId: string) => {
  const existing = await findCityById(cityId);

  if (!existing) {
    throw new AppError({
      message: 'City not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: cityError(CITY_ERROR_CODES.CITY_NOT_FOUND),
    });
  }

  assertCityStatusAllowed(input.status);

  const slug = await resolveSlugForUpdate(
    cityId,
    input.name ?? existing.name,
    existing.slug,
    input.slug,
  );

  const actorId = toObjectIdOrNull(actorUserId);

  const updated = await updateCityById(cityId, {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    slug,
    ...(input.state !== undefined ? { state: input.state.trim() } : {}),
    ...(input.country !== undefined ? { country: input.country.trim() } : {}),
    ...(input.timezone !== undefined ? { timezone: input.timezone.trim() } : {}),
    ...(input.currencyCode !== undefined
      ? { currencyCode: input.currencyCode.trim().toUpperCase() }
      : {}),
    ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
    ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
    ...(input.serviceRadiusKm !== undefined ? { serviceRadiusKm: input.serviceRadiusKm } : {}),
    ...(input.isServiceable !== undefined ? { isServiceable: input.isServiceable } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'City not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: cityError(CITY_ERROR_CODES.CITY_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: CITY_AUDIT_EVENTS.CITY_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'city',
    entityId: updated._id,
    vendorId: null,
    storeId: null,
    cityId: updated._id,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      cityId: updated._id.toString(),
    },
    status: 'success',
  });

  return toCityResponse(updated);
};

export const deleteCity = async (cityId: string, actorUserId: string) => {
  const existing = await findCityById(cityId);

  if (!existing) {
    throw new AppError({
      message: 'City not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: cityError(CITY_ERROR_CODES.CITY_NOT_FOUND),
    });
  }

  const serviceAreaCount = await countActiveServiceAreasByCity(cityId);

  if (serviceAreaCount > 0) {
    throw new AppError({
      message: 'City has active service areas and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: cityError(CITY_ERROR_CODES.CITY_HAS_ACTIVE_SERVICE_AREAS),
    });
  }

  const storeCount = await countActiveStoresByCity(cityId);

  if (storeCount > 0) {
    throw new AppError({
      message: 'City has active stores and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: cityError(CITY_ERROR_CODES.CITY_HAS_ACTIVE_STORES),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);

  const deleted = await softDeleteCityById(cityId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'City not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: cityError(CITY_ERROR_CODES.CITY_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: CITY_AUDIT_EVENTS.CITY_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'city',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: deleted._id,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      cityId: deleted._id.toString(),
    },
    status: 'success',
  });

  return toCityResponse(deleted);
};
