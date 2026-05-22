import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { CustomerAddressRecord } from '../models/customer-address.model';
import type { StoreRecord } from '../../stores/models/store.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as addressRepositoryModule from '../repositories/customer-address.repository';
import * as selectionRepositoryModule from '../repositories/customer-store-selection.repository';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import * as serviceabilityModule from './store-serviceability.service';
import { selectStoreForCustomer } from './customer-store-selection.service';

const addressRepository = addressRepositoryModule as unknown as {
  findAddressByIdForCustomer: (
    addressId: string,
    customerId: string,
  ) => Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null>;
};

const storeRepository = storeRepositoryModule as unknown as {
  findStoreById: (storeId: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
};

const selectionRepository = selectionRepositoryModule as unknown as {
  upsertSelectedStore: (payload: {
    customerId: string;
    addressId: string;
    storeId: string;
  }) => Promise<{ _id: Types.ObjectId }>;
};

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const serviceabilityService = serviceabilityModule as unknown as {
  isStoreServiceableForCoordinates: typeof serviceabilityModule.isStoreServiceableForCoordinates;
};

const customerId = new Types.ObjectId().toString();
const addressId = new Types.ObjectId();
const storeId = new Types.ObjectId();

const originalServiceability = serviceabilityService.isStoreServiceableForCoordinates;

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

afterEach(() => {
  addressRepository.findAddressByIdForCustomer = addressRepositoryModule.findAddressByIdForCustomer;
  storeRepository.findStoreById = storeRepositoryModule.findStoreById;
  selectionRepository.upsertSelectedStore = selectionRepositoryModule.upsertSelectedStore;
  serviceabilityService.isStoreServiceableForCoordinates = originalServiceability;
});

test('selectStoreForCustomer persists selection for serviceable store', async () => {
  addressRepository.findAddressByIdForCustomer = async () =>
    ({
      _id: addressId,
      customerId: new Types.ObjectId(customerId),
      label: 'Home',
      line1: 'Sector 10',
      line2: null,
      landmark: null,
      city: 'Delhi',
      cityId: null,
      state: null,
      postalCode: null,
      country: 'IN',
      latitude: 28.5921,
      longitude: 77.046,
      isDefault: true,
      status: 'active',
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as CustomerAddressRecord & { _id: Types.ObjectId };

  storeRepository.findStoreById = async () =>
    ({
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as StoreRecord & { _id: Types.ObjectId };

  serviceabilityService.isStoreServiceableForCoordinates = async () => true;
  selectionRepository.upsertSelectedStore = async () => ({ _id: new Types.ObjectId() });

  const result = await selectStoreForCustomer(
    customerId,
    { addressId: addressId.toString(), storeId: storeId.toString() },
    { actorId: customerId },
  );

  assert.equal(result.isSelected, true);
  assert.equal(result.storeId, storeId.toString());
});

test('selectStoreForCustomer rejects unknown store', async () => {
  addressRepository.findAddressByIdForCustomer = async () =>
    ({ _id: addressId } as CustomerAddressRecord & { _id: Types.ObjectId });
  storeRepository.findStoreById = async () => null;

  await assert.rejects(
    () =>
      selectStoreForCustomer(
        customerId,
        { addressId: addressId.toString(), storeId: storeId.toString() },
        { actorId: customerId },
      ),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.STORE_NOT_FOUND,
  );
});
