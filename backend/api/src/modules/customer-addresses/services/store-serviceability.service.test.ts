import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { StoreRecord } from '../../stores/models/store.model';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import { haversineDistanceKm } from '../utils/haversine-distance.util';
import {
  findNearestServiceableStore,
  isStoreServiceableForCoordinates,
} from './store-serviceability.service';

type StoreRepositoryModule = {
  findActiveStoresForServiceability: (
    cityId?: string,
  ) => Promise<(StoreRecord & { _id: Types.ObjectId })[]>;
  findStoreById: (storeId: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
};

const storeRepository = storeRepositoryModule as unknown as StoreRepositoryModule;
const storeId = new Types.ObjectId();

const buildStore = (
  overrides: Partial<StoreRecord & { _id: Types.ObjectId }> = {},
): StoreRecord & { _id: Types.ObjectId } => ({
  _id: storeId,
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  serviceAreaIds: [],
  name: 'Zepto Dwarka',
  slug: 'zepto-dwarka',
  code: 'STORE-000001',
  description: null,
  phone: '9999999998',
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
  operatingDays: [],
  isOpen: true,
  isAcceptingOrders: true,
  temporaryClosureReason: null,
  storeType: 'dark_store',
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

afterEach(() => {
  storeRepository.findActiveStoresForServiceability =
    storeRepositoryModule.findActiveStoresForServiceability;
  storeRepository.findStoreById = storeRepositoryModule.findStoreById;
});

test('haversineDistanceKm returns zero for same point', () => {
  assert.equal(haversineDistanceKm(28.5921, 77.046, 28.5921, 77.046), 0);
});

test('findNearestServiceableStore returns nearest store within radius', async () => {
  storeRepository.findActiveStoresForServiceability = async () => [buildStore()];

  const result = await findNearestServiceableStore({
    latitude: 28.5922,
    longitude: 77.0461,
  });

  assert.equal(result.storeId, storeId.toString());
  assert.equal(result.storeName, 'Zepto Dwarka');
});

test('findNearestServiceableStore throws when no store in range', async () => {
  storeRepository.findActiveStoresForServiceability = async () => [
    buildStore({ serviceRadiusKm: 0.001 }),
  ];

  await assert.rejects(
    () =>
      findNearestServiceableStore({
        latitude: 29,
        longitude: 78,
      }),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES.SERVICEABILITY_AREA_UNAVAILABLE,
  );
});

test('isStoreServiceableForCoordinates validates distance', async () => {
  storeRepository.findStoreById = async () => buildStore();

  const serviceable = await isStoreServiceableForCoordinates({
    storeId: storeId.toString(),
    latitude: 28.5921,
    longitude: 77.046,
  });

  assert.equal(serviceable, true);
});
