import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { CustomerAddressRecord } from '../models/customer-address.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as addressRepositoryModule from '../repositories/customer-address.repository';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  updateCustomerAddress,
} from './customer-address.service';

type AddressRepositoryModule = {
  findAddressByIdForCustomer: (
    addressId: string,
    customerId: string,
  ) => Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null>;
  createAddress: (
    payload: Partial<CustomerAddressRecord>,
  ) => Promise<CustomerAddressRecord & { _id: Types.ObjectId }>;
  updateAddressById: (
    addressId: string,
    customerId: string,
    payload: Partial<CustomerAddressRecord>,
  ) => Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null>;
  softDeleteAddressById: (
    addressId: string,
    customerId: string,
  ) => Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null>;
  clearDefaultForCustomer: (customerId: string) => Promise<void>;
};

const addressRepository = addressRepositoryModule as unknown as AddressRepositoryModule;
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const customerId = new Types.ObjectId().toString();
const addressId = new Types.ObjectId();
const actorId = customerId;

const buildAddress = (
  overrides: Partial<CustomerAddressRecord & { _id: Types.ObjectId }> = {},
): CustomerAddressRecord & { _id: Types.ObjectId } => ({
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
  isDefault: false,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

afterEach(() => {
  addressRepository.findAddressByIdForCustomer = addressRepositoryModule.findAddressByIdForCustomer;
  addressRepository.createAddress = addressRepositoryModule.createAddress;
  addressRepository.updateAddressById = addressRepositoryModule.updateAddressById;
  addressRepository.softDeleteAddressById = addressRepositoryModule.softDeleteAddressById;
  addressRepository.clearDefaultForCustomer = addressRepositoryModule.clearDefaultForCustomer;
});

test('createCustomerAddress creates address and clears default when needed', async () => {
  let cleared = false;
  addressRepository.clearDefaultForCustomer = async () => {
    cleared = true;
  };
  addressRepository.createAddress = async (payload) =>
    buildAddress({ ...payload, isDefault: true });

  const created = await createCustomerAddress(
    customerId,
    {
      label: 'Home',
      line1: 'Sector 10',
      city: 'Delhi',
      latitude: 28.5921,
      longitude: 77.046,
      isDefault: true,
    },
    { actorId },
  );

  assert.equal(cleared, true);
  assert.equal(created.isDefault, true);
});

test('updateCustomerAddress throws when address missing', async () => {
  addressRepository.findAddressByIdForCustomer = async () => null;

  await assert.rejects(
    () =>
      updateCustomerAddress(customerId, addressId.toString(), { label: 'Work' }, { actorId }),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.ADDRESS_NOT_FOUND,
  );
});

test('setDefaultCustomerAddress sets default flag', async () => {
  addressRepository.findAddressByIdForCustomer = async () => buildAddress();
  addressRepository.clearDefaultForCustomer = async () => undefined;
  addressRepository.updateAddressById = async () => buildAddress({ isDefault: true });

  const updated = await setDefaultCustomerAddress(customerId, addressId.toString(), { actorId });

  assert.equal(updated.isDefault, true);
});

test('deleteCustomerAddress soft deletes record', async () => {
  addressRepository.softDeleteAddressById = async () => buildAddress({ isDeleted: true });

  await deleteCustomerAddress(customerId, addressId.toString(), { actorId });
});
