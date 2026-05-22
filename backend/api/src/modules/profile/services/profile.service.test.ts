import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import type { UserIdentityRecord } from '../../auth/models/user-identity.model';
import * as profileRepositoryModule from '../repositories/profile.repository';
import { getCustomerProfile, updateCustomerProfile } from './profile.service';

const profileRepository = profileRepositoryModule as unknown as {
  findCustomerProfileById: typeof profileRepositoryModule.findCustomerProfileById;
  updateCustomerProfileById: typeof profileRepositoryModule.updateCustomerProfileById;
};

const customerId = new Types.ObjectId().toString();

const buildUser = (): UserIdentityRecord & { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(customerId),
  phone: '9999999999',
  email: 'old@example.com',
  name: 'Old Name',
  role: AUTH_ROLE.CUSTOMER,
  accountStatus: 'active',
  permissions: [],
  vendorId: null,
  storeId: null,
  cityId: null,
  lastLoginAt: null,
  createdBy: null,
  updatedBy: null,
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

beforeEach(() => {
  profileRepository.findCustomerProfileById = (async () => buildUser()) as unknown as typeof profileRepositoryModule.findCustomerProfileById;
  profileRepository.updateCustomerProfileById = (async () => ({
    ...buildUser(),
    name: 'New Name',
    email: 'new@example.com',
  })) as unknown as typeof profileRepositoryModule.updateCustomerProfileById;
});

afterEach(() => {
  profileRepository.findCustomerProfileById = (async () => buildUser()) as unknown as typeof profileRepositoryModule.findCustomerProfileById;
  profileRepository.updateCustomerProfileById = (async () => buildUser()) as unknown as typeof profileRepositoryModule.updateCustomerProfileById;
});

test('getCustomerProfile returns mapped profile', async () => {
  const result = await getCustomerProfile(customerId);

  assert.equal(result.customerId, customerId);
  assert.equal(result.phone, '9999999999');
  assert.equal(result.name, 'Old Name');
});

test('getCustomerProfile throws when user missing', async () => {
  profileRepository.findCustomerProfileById = (async () => null) as unknown as typeof profileRepositoryModule.findCustomerProfileById;

  await assert.rejects(
    () => getCustomerProfile(customerId),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.USER_NOT_FOUND);
      return true;
    },
  );
});

test('updateCustomerProfile updates name and email', async () => {
  const result = await updateCustomerProfile(customerId, {
    name: 'New Name',
    email: 'new@example.com',
  });

  assert.equal(result.name, 'New Name');
  assert.equal(result.email, 'new@example.com');
});

test('updateCustomerProfile throws when user missing', async () => {
  profileRepository.updateCustomerProfileById = (async () => null) as unknown as typeof profileRepositoryModule.updateCustomerProfileById;

  await assert.rejects(
    () => updateCustomerProfile(customerId, { name: 'X' }),
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.errorCode, ERROR_CODES.USER_NOT_FOUND);
      return true;
    },
  );
});
