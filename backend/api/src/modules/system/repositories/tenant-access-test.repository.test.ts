import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as modelModule from '../models/tenant-access-test.model';
import {
  createTenantAccessTestRecord,
  findTenantAccessTestsByCustomer,
  findTenantAccessTestsByDeliveryAgent,
  findTenantAccessTestsByVendorStore,
} from './tenant-access-test.repository';

const mutableModelModule = modelModule as unknown as {
  TenantAccessTestModel: {
    create: (input: unknown) => Promise<unknown>;
    find: (filter: unknown) => {
      sort: (input: unknown) => { exec: () => Promise<unknown> };
    };
  };
};

test('createTenantAccessTestRecord persists the expected fields', async () => {
  const originalCreate = mutableModelModule.TenantAccessTestModel.create;

  let createInput: Record<string, unknown> | null = null;
  mutableModelModule.TenantAccessTestModel.create = async (input: unknown) => {
    createInput = input as Record<string, unknown>;
    return input;
  };

  await createTenantAccessTestRecord({
    vendorId: 'vendor-1',
    storeId: 'store-1',
    cityId: 'city-1',
    customerId: 'customer-1',
    deliveryAgentId: 'delivery-1',
    label: 'record-1',
  });

  mutableModelModule.TenantAccessTestModel.create = originalCreate;

  assert.deepEqual(createInput, {
    vendorId: 'vendor-1',
    storeId: 'store-1',
    cityId: 'city-1',
    customerId: 'customer-1',
    deliveryAgentId: 'delivery-1',
    label: 'record-1',
    status: 'active',
    isDeleted: false,
    deletedAt: null,
  });
});

test('tenant access repository vendor/store lookup excludes soft-deleted records', async () => {
  const originalFind = mutableModelModule.TenantAccessTestModel.find;
  let receivedFilter: Record<string, unknown> | null = null;

  mutableModelModule.TenantAccessTestModel.find = (filter: unknown) => {
    receivedFilter = filter as Record<string, unknown>;
    return {
      sort: () => ({
        exec: async () => [],
      }),
    };
  };

  await findTenantAccessTestsByVendorStore({
    vendorId: 'vendor-1',
    storeId: 'store-1',
  });

  mutableModelModule.TenantAccessTestModel.find = originalFind;

  assert.deepEqual(receivedFilter, {
    isDeleted: false,
    vendorId: 'vendor-1',
    storeId: 'store-1',
  });
});

test('tenant access repository customer lookup uses customerId filter and excludes soft delete', async () => {
  const originalFind = mutableModelModule.TenantAccessTestModel.find;
  let receivedFilter: Record<string, unknown> | null = null;

  mutableModelModule.TenantAccessTestModel.find = (filter: unknown) => {
    receivedFilter = filter as Record<string, unknown>;
    return {
      sort: () => ({
        exec: async () => [],
      }),
    };
  };

  await findTenantAccessTestsByCustomer({
    customerId: 'customer-1',
  });

  mutableModelModule.TenantAccessTestModel.find = originalFind;

  assert.deepEqual(receivedFilter, {
    isDeleted: false,
    customerId: 'customer-1',
  });
});

test('tenant access repository delivery-agent lookup uses deliveryAgentId filter and excludes soft delete', async () => {
  const originalFind = mutableModelModule.TenantAccessTestModel.find;
  let receivedFilter: Record<string, unknown> | null = null;

  mutableModelModule.TenantAccessTestModel.find = (filter: unknown) => {
    receivedFilter = filter as Record<string, unknown>;
    return {
      sort: () => ({
        exec: async () => [],
      }),
    };
  };

  await findTenantAccessTestsByDeliveryAgent({
    deliveryAgentId: 'delivery-1',
  });

  mutableModelModule.TenantAccessTestModel.find = originalFind;

  assert.deepEqual(receivedFilter, {
    isDeleted: false,
    deliveryAgentId: 'delivery-1',
  });
});
