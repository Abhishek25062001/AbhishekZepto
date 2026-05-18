import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { CityRecord } from '../../locations/cities/models/city.model';
import * as cityRepositoryModule from '../../locations/cities/repositories/city.repository';
import * as serviceAreaRepositoryModule from '../../locations/service-areas/repositories/service-area.repository';
import { STORE_ERROR_CODES } from '../constants/store-error-codes.constant';
import type { StoreRecord } from '../models/store.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as storeRepositoryModule from '../repositories/store.repository';
import { createStore, deleteStore, updateStore } from './store.service';

type StoreRepositoryModule = {
  findStoreById: (storeId: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
  findStoreByCityAndSlug: (
    cityId: string,
    slug: string,
    excludeId?: string,
  ) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
  findStoreByCode: (code: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
  findNextStoreCode: () => Promise<string>;
  createStore: (payload: Partial<StoreRecord>) => Promise<StoreRecord & { _id: Types.ObjectId }>;
  updateStoreById: (
    storeId: string,
    payload: Partial<StoreRecord>,
  ) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
  softDeleteStoreById: (
    storeId: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
};

const storeRepository = storeRepositoryModule as unknown as StoreRepositoryModule;
const cityRepository = cityRepositoryModule as unknown as {
  findCityById: (cityId: string) => Promise<(CityRecord & { _id: Types.ObjectId }) | null>;
};
const serviceAreaRepository = serviceAreaRepositoryModule as unknown as {
  countActiveServiceAreasForCityAndIds: (cityId: string, ids: string[]) => Promise<number>;
};
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const noopAuditLog = async () => undefined;

const cityId = new Types.ObjectId();
const storeId = new Types.ObjectId();
const vendorId = new Types.ObjectId('65f0a0000000000000000001');
const actorId = new Types.ObjectId().toString();

const buildCity = (): CityRecord & { _id: Types.ObjectId } => ({
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
});

const buildStore = (
  overrides: Partial<StoreRecord & { _id: Types.ObjectId }> = {},
): StoreRecord & { _id: Types.ObjectId } => ({
  _id: storeId,
  vendorId,
  cityId,
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
  latitude: 28.5921,
  longitude: 77.046,
  serviceRadiusKm: 5,
  openingTime: '08:00',
  closingTime: '22:00',
  operatingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
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
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

const baseCreateInput = {
  vendorId: vendorId.toString(),
  cityId: cityId.toString(),
  name: 'Zepto Dwarka',
  phone: '9999999999',
  addressLine1: 'Sector 10',
  pincode: '110075',
  latitude: 28.5921,
  longitude: 77.046,
  serviceRadiusKm: 5,
  openingTime: '08:00',
  closingTime: '22:00',
  operatingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  storeType: 'grocery' as const,
  fulfillmentType: 'delivery' as const,
};

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

beforeEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  cityRepository.findCityById = async () => buildCity();
  serviceAreaRepository.countActiveServiceAreasForCityAndIds = async () => 0;
});

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
});

test('createStore creates store with generated slug and code', async () => {
  storeRepository.findStoreByCityAndSlug = async () => null;
  storeRepository.findStoreByCode = async () => null;
  storeRepository.findNextStoreCode = async () => 'STORE-000001';
  storeRepository.createStore = async (payload) => buildStore({ ...payload, _id: storeId });

  const created = await createStore(baseCreateInput, actorId);

  assert.equal(created.slug, 'zepto-dwarka');
  assert.equal(created.code, 'STORE-000001');
});

test('createStore rejects invalid city', async () => {
  cityRepository.findCityById = async () => null;

  await assert.rejects(
    () => createStore(baseCreateInput, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[STORE_ERROR_CODES.INVALID_STORE_CITY]),
  );
});

test('createStore rejects duplicate slug in city', async () => {
  storeRepository.findStoreByCityAndSlug = async () => buildStore();

  await assert.rejects(
    () => createStore({ ...baseCreateInput, slug: 'zepto-dwarka' }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[STORE_ERROR_CODES.STORE_SLUG_ALREADY_EXISTS]),
  );
});

test('updateStore requires closure reason when closing', async () => {
  storeRepository.findStoreById = async () => buildStore();
  storeRepository.findStoreByCityAndSlug = async () => null;

  await assert.rejects(
    () => updateStore(storeId.toString(), { isOpen: false }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(
        error,
        ERROR_CODES[STORE_ERROR_CODES.TEMPORARY_CLOSURE_REASON_REQUIRED],
      ),
  );
});

test('updateStore rejects immutable code changes', async () => {
  storeRepository.findStoreById = async () => buildStore();

  await assert.rejects(
    () => updateStore(storeId.toString(), { code: 'STORE-999999' }, actorId),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[STORE_ERROR_CODES.STORE_CODE_IMMUTABLE]),
  );
});

test('deleteStore soft deletes when no active orders (stub)', async () => {
  storeRepository.findStoreById = async () => buildStore();
  storeRepository.softDeleteStoreById = async () => buildStore({ isDeleted: true });

  const deleted = await deleteStore(storeId.toString(), actorId);

  assert.equal(deleted.code, 'STORE-000001');
});
