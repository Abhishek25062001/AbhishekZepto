import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { requireAnyPermission } from '../../../modules/auth/middlewares/require-any-permission.middleware';
import { requirePermission } from '../../../modules/auth/middlewares/require-permission.middleware';
import {
  ACCESS_CONTROL_FIXTURE_PERMISSIONS,
  ACCESS_CONTROL_TEST_USERS,
  createMockAuthenticatedRequest,
  runAccessControlMiddleware,
} from '../index';

test('requirePermission allows operations admin for auth:manage and denies customer', async () => {
  const middleware = requirePermission(ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_MANAGE);

  const allowed = await runAccessControlMiddleware(
    middleware,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN]),
  );
  assert.equal(allowed.allowed, true);

  const denied = await runAccessControlMiddleware(
    middleware,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER]),
  );
  assert.equal(denied.allowed, false);
  assert.equal(denied.errorCode, ERROR_CODES.FORBIDDEN);
});

test('requireAnyPermission allows support admin session read alternatives', async () => {
  const middleware = requireAnyPermission([
    ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_READ,
    ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ,
    ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.SETTINGS_MANAGE,
  ]);

  const allowed = await runAccessControlMiddleware(
    middleware,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN]),
  );
  assert.equal(allowed.allowed, true);

  const denied = await runAccessControlMiddleware(
    middleware,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.STORE_STAFF]),
  );
  assert.equal(denied.allowed, false);
  assert.equal(denied.errorCode, ERROR_CODES.FORBIDDEN);
});

test('invalid fixture permissions are denied for all role fixtures', async () => {
  const middleware = requirePermission(
    ACCESS_CONTROL_FIXTURE_PERMISSIONS.INVALID.PAYMENTS_MANAGE,
  );

  for (const role of [
    AUTH_ROLE.CUSTOMER,
    AUTH_ROLE.VENDOR_OWNER,
    AUTH_ROLE.SUPPORT_ADMIN,
    AUTH_ROLE.SUPER_ADMIN,
  ] as const) {
    const result = await runAccessControlMiddleware(
      middleware,
      createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[role]),
    );

    if (role === AUTH_ROLE.SUPER_ADMIN) {
      assert.equal(result.allowed, true);
      continue;
    }

    assert.equal(result.allowed, false);
    assert.equal(result.errorCode, ERROR_CODES.FORBIDDEN);
  }
});
