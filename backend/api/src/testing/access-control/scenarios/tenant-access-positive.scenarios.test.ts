import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { requireCityScope } from '../../../modules/auth/middlewares/require-city-scope.middleware';
import { requireStoreScope } from '../../../modules/auth/middlewares/require-store-scope.middleware';
import { requireVendorScope } from '../../../modules/auth/middlewares/require-vendor-scope.middleware';
import * as repositoryModule from '../../../modules/system/repositories/tenant-access-test.repository';
import { listTenantAccessTestsByCustomerScope } from '../../../modules/system/services/tenant-access-test.service';
import {
  ACCESS_CONTROL_TENANT_SCOPE_FIXTURES,
  ACCESS_CONTROL_TEST_USERS,
  createAuthUserContextFromFixture,
  createMockAuthenticatedRequest,
  evaluateAccessControlAction,
  runAccessControlMiddleware,
} from '../index';

const repository = repositoryModule as unknown as {
  findTenantAccessTestsByCustomer: (...args: unknown[]) => Promise<unknown>;
};

test('vendor tenant scope guards allow owned vendor, store, and city', async () => {
  const vendorRequest = createMockAuthenticatedRequest(
    ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.VENDOR_OWNER],
    {
      query: { vendorId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.VENDOR_ID },
    },
  );

  const vendorAllowed = await runAccessControlMiddleware(
    requireVendorScope((request) =>
      typeof request.query?.vendorId === 'string' ? request.query.vendorId : null,
    ),
    vendorRequest,
  );
  assert.equal(vendorAllowed.allowed, true);

  const storeAllowed = await runAccessControlMiddleware(
    requireStoreScope((request) =>
      typeof request.query?.storeId === 'string' ? request.query.storeId : null,
    ),
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.STORE_MANAGER], {
      query: { storeId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.STORE_ID },
    }),
  );
  assert.equal(storeAllowed.allowed, true);

  const cityAllowed = await runAccessControlMiddleware(
    requireCityScope((request) =>
      typeof request.query?.cityId === 'string' ? request.query.cityId : null,
    ),
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.DELIVERY_AGENT], {
      query: { cityId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.CITY_ID },
    }),
  );
  assert.equal(cityAllowed.allowed, true);
});

test('customer tenant self-access returns scoped records', async () => {
  const original = repository.findTenantAccessTestsByCustomer;
  repository.findTenantAccessTestsByCustomer = async () => [{ label: 'owned-record' }];

  const result = await evaluateAccessControlAction(async () => {
    const records = await listTenantAccessTestsByCustomerScope({
      user: createAuthUserContextFromFixture(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER]),
      customerId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER].userId,
    });
    assert.deepEqual(records, [{ label: 'owned-record' }]);
  });

  repository.findTenantAccessTestsByCustomer = original;
  assert.equal(result.allowed, true);
});
