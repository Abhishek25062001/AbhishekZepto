import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { CITY_ERROR_CODES } from '../../cities/constants/city-error-codes.constant';
import type { CityRecord } from '../../cities/models/city.model';
import * as cityRepositoryModule from '../../cities/repositories/city.repository';
import { SERVICE_AREA_ERROR_CODES } from '../constants/service-area-error-codes.constant';
import type { ServiceAreaRecord } from '../models/service-area.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as serviceAreaRepositoryModule from '../repositories/service-area.repository';
import * as storeRepositoryModule from '../../../stores/repositories/store.repository';
import { createServiceArea, deleteServiceArea } from './service-area.service';

type ServiceAreaRepositoryModule = {
  findServiceAreaByCityAndSlug: (
    cityId: string,
    slug: string,
    excludeId?: string,
  ) => Promise<(ServiceAreaRecord & { _id: Types.ObjectId }) | null>;
  findServiceAreaById: (
    serviceAreaId: string,
  ) => Promise<(ServiceAreaRecord & { _id: Types.ObjectId }) | null>;
  createServiceArea: (
    payload: Partial<ServiceAreaRecord>,
  ) => Promise<ServiceAreaRecord & { _id: Types.ObjectId }>;
  softDeleteServiceAreaById: (
    serviceAreaId: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(ServiceAreaRecord & { _id: Types.ObjectId }) | null>;
};

const serviceAreaRepository = serviceAreaRepositoryModule as unknown as ServiceAreaRepositoryModule;
const cityRepository = cityRepositoryModule as unknown as {
  findCityById: (cityId: string) => Promise<(CityRecord & { _id: Types.ObjectId }) | null>;
};
const storeRepository = storeRepositoryModule as unknown as {
  countActiveStoresByServiceArea: (serviceAreaId: string) => Promise<number>;
};
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const noopAuditLog = async () => undefined;

const cityId = new Types.ObjectId();
const serviceAreaId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildCity = (
  overrides: Partial<CityRecord & { _id: Types.ObjectId }> = {},
): CityRecord & { _id: Types.ObjectId } => ({
  _id: cityId,
  name: 'Delhi',
  slug: 'delhi',
  state: 'Delhi',
  country: 'India',
  timezone: 'Asia/Kolkata',
  currencyCode: 'INR',
  latitude: null,
  longitude: null,
  serviceRadiusKm: null,
  isServiceable: true,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

const buildServiceArea = (
  overrides: Partial<ServiceAreaRecord & { _id: Types.ObjectId }> = {},
): ServiceAreaRecord & { _id: Types.ObjectId } => ({
  _id: serviceAreaId,
  cityId,
  name: 'Dwarka',
  slug: 'dwarka',
  description: null,
  polygon: null,
  centerLatitude: null,
  centerLongitude: null,
  radiusKm: null,
  isServiceable: true,
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
});

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
});

test('createServiceArea creates service area with generated slug', async () => {
  cityRepository.findCityById = async () => buildCity();
  serviceAreaRepository.findServiceAreaByCityAndSlug = async () => null;
  serviceAreaRepository.createServiceArea = async (payload) =>
    buildServiceArea({ ...payload, _id: serviceAreaId });

  const created = await createServiceArea(
    { cityId: cityId.toString(), name: 'Dwarka' },
    actorId,
  );

  assert.equal(created.slug, 'dwarka');
});

test('createServiceArea rejects when city not found', async () => {
  cityRepository.findCityById = async () => null;

  await assert.rejects(
    () => createServiceArea({ cityId: cityId.toString(), name: 'Dwarka' }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CITY_ERROR_CODES.CITY_NOT_FOUND]),
  );
});

test('createServiceArea rejects when city is not serviceable', async () => {
  cityRepository.findCityById = async () => buildCity({ isServiceable: false });

  await assert.rejects(
    () => createServiceArea({ cityId: cityId.toString(), name: 'Dwarka' }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CITY_ERROR_CODES.CITY_NOT_SERVICEABLE]),
  );
});

test('deleteServiceArea blocks when active stores exist', async () => {
  serviceAreaRepository.findServiceAreaById = async () => buildServiceArea();
  storeRepository.countActiveStoresByServiceArea = async () => 1;

  await assert.rejects(
    () => deleteServiceArea(serviceAreaId.toString(), actorId),
    (error: unknown) =>
      isAppErrorWithCode(
        error,
        ERROR_CODES[SERVICE_AREA_ERROR_CODES.SERVICE_AREA_HAS_ACTIVE_STORES],
      ),
  );
});
