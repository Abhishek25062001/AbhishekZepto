import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import type { PermissionCode } from '../../auth/types/auth-permission.types';
import * as repositoryModule from '../repositories/tenant-access-test.repository';
import {
  createInternalTenantAccessTestRecord,
  listTenantAccessTestsByCustomerScope,
  listTenantAccessTestsByDeliveryAgentScope,
  listTenantAccessTestsByVendorStoreScope,
} from './tenant-access-test.service';

const mutableRepositoryModule = repositoryModule as unknown as {
  createTenantAccessTestRecord: (...args: unknown[]) => Promise<unknown>;
  findTenantAccessTestsByVendorStore: (...args: unknown[]) => Promise<unknown>;
  findTenantAccessTestsByCustomer: (...args: unknown[]) => Promise<unknown>;
  findTenantAccessTestsByDeliveryAgent: (...args: unknown[]) => Promise<unknown>;
};

const adminUser = {
  userId: '68295cf6d5cc8fddf6b8d210',
  role: 'support_admin' as const,
  permissions: ['users:read'] as PermissionCode[],
  sessionId: 'session-1',
  vendorId: null,
  storeId: null,
  cityId: null,
};

test('createInternalTenantAccessTestRecord delegates to repository create', async () => {
  const original = mutableRepositoryModule.createTenantAccessTestRecord;
  mutableRepositoryModule.createTenantAccessTestRecord = async (input: unknown) => input;

  const result = await createInternalTenantAccessTestRecord({
    vendorId: 'vendor-1',
    label: 'record-1',
  });

  mutableRepositoryModule.createTenantAccessTestRecord = original;

  assert.deepEqual(result, {
    vendorId: 'vendor-1',
    label: 'record-1',
  });
});

test('listTenantAccessTestsByVendorStoreScope loads scoped records', async () => {
  const original = mutableRepositoryModule.findTenantAccessTestsByVendorStore;
  mutableRepositoryModule.findTenantAccessTestsByVendorStore = async () => [{ label: 'record-1' }];

  const result = await listTenantAccessTestsByVendorStoreScope({
    vendorId: 'vendor-1',
    storeId: 'store-1',
  });

  mutableRepositoryModule.findTenantAccessTestsByVendorStore = original;

  assert.deepEqual(result, [{ label: 'record-1' }]);
});

test('listTenantAccessTestsByCustomerScope allows self-access for customer users', async () => {
  const original = mutableRepositoryModule.findTenantAccessTestsByCustomer;
  mutableRepositoryModule.findTenantAccessTestsByCustomer = async () => [{ label: 'record-1' }];

  const result = await listTenantAccessTestsByCustomerScope({
    user: {
      userId: 'customer-1',
      role: 'customer',
      permissions: ['customer:read_self'],
      sessionId: 'session-1',
      vendorId: null,
      storeId: null,
      cityId: null,
    },
    customerId: 'customer-1',
  });

  mutableRepositoryModule.findTenantAccessTestsByCustomer = original;

  assert.deepEqual(result, [{ label: 'record-1' }]);
});

test('listTenantAccessTestsByCustomerScope blocks mismatched customer self-access', async () => {
  await assert.rejects(
    () =>
      listTenantAccessTestsByCustomerScope({
        user: {
          userId: 'customer-1',
          role: 'customer',
          permissions: ['customer:read_self'],
          sessionId: 'session-1',
          vendorId: null,
          storeId: null,
          cityId: null,
        },
        customerId: 'customer-2',
      }),
    (error: unknown) => error instanceof AppError && error.statusCode === 403,
  );
});

test('listTenantAccessTestsByDeliveryAgentScope allows admin override via current users:read pattern', async () => {
  const original = mutableRepositoryModule.findTenantAccessTestsByDeliveryAgent;
  mutableRepositoryModule.findTenantAccessTestsByDeliveryAgent = async () => [{ label: 'record-1' }];

  const result = await listTenantAccessTestsByDeliveryAgentScope({
    user: adminUser,
    deliveryAgentId: 'delivery-1',
  });

  mutableRepositoryModule.findTenantAccessTestsByDeliveryAgent = original;

  assert.deepEqual(result, [{ label: 'record-1' }]);
});
