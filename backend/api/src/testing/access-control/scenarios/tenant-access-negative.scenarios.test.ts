import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { requireStoreScope } from '../../../modules/auth/middlewares/require-store-scope.middleware';
import { requireVendorScope } from '../../../modules/auth/middlewares/require-vendor-scope.middleware';
import { listTenantAccessTestsByCustomerScope } from '../../../modules/system/services/tenant-access-test.service';
import {
  ACCESS_CONTROL_DENY_ERROR_CODES,
  ACCESS_CONTROL_TENANT_SCOPE_FIXTURES,
  ACCESS_CONTROL_TEST_USERS,
  createAuthUserContextFromFixture,
  createMockAuthenticatedRequest,
  evaluateAccessControlAction,
  runAccessControlMiddleware,
} from '../index';

test('vendor scope guards deny missing and foreign vendor access', async () => {
  const missingScope = await runAccessControlMiddleware(
    requireVendorScope((request) =>
      typeof request.query?.vendorId === 'string' ? request.query.vendorId : null,
    ),
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN]),
  );
  assert.equal(missingScope.allowed, false);
  assert.equal(missingScope.errorCode, ACCESS_CONTROL_DENY_ERROR_CODES.VENDOR_SCOPE_REQUIRED);

  const mismatch = await runAccessControlMiddleware(
    requireVendorScope((request) =>
      typeof request.query?.vendorId === 'string' ? request.query.vendorId : null,
    ),
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.VENDOR_OWNER], {
      query: { vendorId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.FOREIGN_VENDOR_ID },
    }),
  );
  assert.equal(mismatch.allowed, false);
  assert.equal(mismatch.errorCode, ACCESS_CONTROL_DENY_ERROR_CODES.VENDOR_SCOPE_MISMATCH);
});

test('store scope guard denies foreign store access', async () => {
  const denied = await runAccessControlMiddleware(
    requireStoreScope((request) =>
      typeof request.query?.storeId === 'string' ? request.query.storeId : null,
    ),
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.STORE_STAFF], {
      query: { storeId: ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.FOREIGN_STORE_ID },
    }),
  );

  assert.equal(denied.allowed, false);
  assert.equal(denied.errorCode, ACCESS_CONTROL_DENY_ERROR_CODES.STORE_SCOPE_MISMATCH);
});

test('customer tenant self-access denies foreign customer id', async () => {
  const result = await evaluateAccessControlAction(async () => {
    await listTenantAccessTestsByCustomerScope({
      user: createAuthUserContextFromFixture(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER]),
      customerId: 'foreign-customer-id',
    });
  });

  assert.equal(result.allowed, false);
  assert.equal(result.errorCode, ERROR_CODES.FORBIDDEN);
});
