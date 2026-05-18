import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { CITY_ERROR_CODES } from '../constants/city-error-codes.constant';
import type { CityRecord } from '../models/city.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as cityRepositoryModule from '../repositories/city.repository';
import * as serviceAreaRepositoryModule from '../../service-areas/repositories/service-area.repository';
import * as storeRepositoryModule from '../../../stores/repositories/store.repository';
import { createCity, deleteCity, getCityById, updateCity } from './city.service';

type CityRepositoryModule = {
  findCityById: (cityId: string) => Promise<(CityRecord & { _id: Types.ObjectId }) | null>;
  findCityBySlug: (
    slug: string,
    excludeId?: string,
  ) => Promise<(CityRecord & { _id: Types.ObjectId }) | null>;
  createCity: (payload: Partial<CityRecord>) => Promise<CityRecord & { _id: Types.ObjectId }>;
  updateCityById: (
    cityId: string,
    payload: Partial<CityRecord>,
  ) => Promise<(CityRecord & { _id: Types.ObjectId }) | null>;
  softDeleteCityById: (
    cityId: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(CityRecord & { _id: Types.ObjectId }) | null>;
};

const cityRepository = cityRepositoryModule as unknown as CityRepositoryModule;
const serviceAreaRepository = serviceAreaRepositoryModule as unknown as {
  countActiveServiceAreasByCity: (cityId: string) => Promise<number>;
};
const storeRepository = storeRepositoryModule as unknown as {
  countActiveStoresByCity: (cityId: string) => Promise<number>;
};
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const noopAuditLog = async () => undefined;

const originalRepository: CityRepositoryModule = {
  findCityById: cityRepository.findCityById,
  findCityBySlug: cityRepository.findCityBySlug,
  createCity: cityRepository.createCity,
  updateCityById: cityRepository.updateCityById,
  softDeleteCityById: cityRepository.softDeleteCityById,
};

const cityId = new Types.ObjectId();
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

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

const baseCreateInput = {
  name: 'Delhi',
  state: 'Delhi',
  timezone: 'Asia/Kolkata',
  currencyCode: 'INR',
};

beforeEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
});

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  cityRepository.findCityById = originalRepository.findCityById;
  cityRepository.findCityBySlug = originalRepository.findCityBySlug;
  cityRepository.createCity = originalRepository.createCity;
  cityRepository.updateCityById = originalRepository.updateCityById;
  cityRepository.softDeleteCityById = originalRepository.softDeleteCityById;
});

test('createCity creates city with generated slug', async () => {
  cityRepository.findCityBySlug = async () => null;
  cityRepository.createCity = async (payload) => buildCity({ ...payload, _id: cityId });

  const created = await createCity(baseCreateInput, actorId);

  assert.equal(created.slug, 'delhi');
});

test('createCity normalizes provided slug', async () => {
  cityRepository.findCityBySlug = async () => null;
  cityRepository.createCity = async (payload) => buildCity({ ...payload, _id: cityId });

  const created = await createCity({ ...baseCreateInput, slug: 'New-Delhi' }, actorId);

  assert.equal(created.slug, 'new-delhi');
});

test('createCity rejects duplicate slug', async () => {
  cityRepository.findCityBySlug = async () => buildCity();

  await assert.rejects(
    () => createCity({ ...baseCreateInput, slug: 'delhi' }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CITY_ERROR_CODES.CITY_SLUG_ALREADY_EXISTS]),
  );
});

test('getCityById returns not found for missing city', async () => {
  cityRepository.findCityById = async () => null;

  await assert.rejects(
    () => getCityById(cityId.toString()),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CITY_ERROR_CODES.CITY_NOT_FOUND]),
  );
});

test('updateCity updates fields', async () => {
  const existing = buildCity();
  cityRepository.findCityById = async () => existing;
  cityRepository.findCityBySlug = async () => null;
  cityRepository.updateCityById = async (_id, payload) =>
    buildCity({ ...existing, ...payload, name: 'Delhi NCR' });

  const updated = await updateCity(cityId.toString(), { name: 'Delhi NCR' }, actorId);

  assert.equal(updated.name, 'Delhi NCR');
});

test('deleteCity soft deletes when no dependencies', async () => {
  const existing = buildCity();
  cityRepository.findCityById = async () => existing;
  serviceAreaRepository.countActiveServiceAreasByCity = async () => 0;
  storeRepository.countActiveStoresByCity = async () => 0;
  cityRepository.softDeleteCityById = async () => buildCity({ isDeleted: true });

  const deleted = await deleteCity(cityId.toString(), actorId);

  assert.equal(deleted.slug, 'delhi');
});

test('deleteCity blocks when active service areas exist', async () => {
  cityRepository.findCityById = async () => buildCity();
  serviceAreaRepository.countActiveServiceAreasByCity = async () => 2;

  await assert.rejects(
    () => deleteCity(cityId.toString(), actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CITY_ERROR_CODES.CITY_HAS_ACTIVE_SERVICE_AREAS]),
  );
});

test('deleteCity blocks when active stores exist', async () => {
  cityRepository.findCityById = async () => buildCity();
  serviceAreaRepository.countActiveServiceAreasByCity = async () => 0;
  storeRepository.countActiveStoresByCity = async () => 1;

  await assert.rejects(
    () => deleteCity(cityId.toString(), actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[CITY_ERROR_CODES.CITY_HAS_ACTIVE_STORES]),
  );
});
