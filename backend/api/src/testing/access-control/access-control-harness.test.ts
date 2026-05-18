import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppError } from '../../errors/AppError';
import { ERROR_CODES } from '../../errors/error-codes';
import { HTTP_STATUS } from '../../utils/http-status';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import {
  ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES,
  ACCESS_CONTROL_DENY_ERROR_CODES,
  ACCESS_CONTROL_FIXTURE_PERMISSIONS,
  ACCESS_CONTROL_MISSING_PERMISSIONS,
  ACCESS_CONTROL_SESSION_STATE_FIXTURES,
  ACCESS_CONTROL_TENANT_SCOPE_FIXTURES,
  ACCESS_CONTROL_TEST_USER_ROLES,
  ACCESS_CONTROL_TEST_USERS,
  createMockAuthContext,
  createMockAuthenticatedRequest,
  createAllowedAccessControlResult,
  createDeniedAccessControlResult,
  evaluateAccessControlAction,
  modelAccessControlResult,
} from './index';

test('access-control harness exposes fixture users for every expected role', () => {
  assert.deepEqual(ACCESS_CONTROL_TEST_USER_ROLES, [
    AUTH_ROLE.CUSTOMER,
    AUTH_ROLE.DELIVERY_AGENT,
    AUTH_ROLE.VENDOR_OWNER,
    AUTH_ROLE.STORE_MANAGER,
    AUTH_ROLE.STORE_STAFF,
    AUTH_ROLE.SUPPORT_ADMIN,
    AUTH_ROLE.OPERATIONS_ADMIN,
    AUTH_ROLE.SUPER_ADMIN,
  ]);

  assert.ok(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPER_ADMIN].permissions.includes('*:*'));
  assert.ok(
    ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.VENDOR_OWNER].permissions.includes(
      ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.VENDOR_READ_STORE,
    ),
  );
});

test('createMockAuthContext builds an authenticated user context from fixtures', () => {
  const context = createMockAuthContext({
    role: AUTH_ROLE.OPERATIONS_ADMIN,
    permissions: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN].permissions,
  });

  assert.equal(context.role, AUTH_ROLE.OPERATIONS_ADMIN);
  assert.equal(context.userId, ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN].userId);
  assert.ok(context.permissions.length > 0);
  assert.equal(context.sessionId, ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN].sessionId);
});

test('createMockAuthenticatedRequest attaches user and bearer header', () => {
  const request = createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER]);

  assert.equal(request.user?.role, AUTH_ROLE.CUSTOMER);
  assert.match(request.headers?.authorization ?? '', /^Bearer /);
});

test('request helper models allowed and denied access-control results', async () => {
  const allowed = await evaluateAccessControlAction(async () => undefined);
  assert.deepEqual(allowed, createAllowedAccessControlResult());

  const denied = await evaluateAccessControlAction(async () => {
    throw new AppError({
      message: 'Permission denied',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.FORBIDDEN,
    });
  });

  assert.deepEqual(
    denied,
    createDeniedAccessControlResult(ERROR_CODES.FORBIDDEN, HTTP_STATUS.FORBIDDEN),
  );
});

test('fixture constants cover permissions, tenant scope, session state, and account status', () => {
  assert.ok(ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ);
  assert.ok(ACCESS_CONTROL_FIXTURE_PERMISSIONS.INVALID.PAYMENTS_MANAGE);
  assert.equal(ACCESS_CONTROL_MISSING_PERMISSIONS.length, 0);

  assert.ok(ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.VENDOR_ID);
  assert.ok(ACCESS_CONTROL_TENANT_SCOPE_FIXTURES.FOREIGN_STORE_ID);

  assert.ok(ACCESS_CONTROL_SESSION_STATE_FIXTURES.ACTIVE_SESSION_ID);
  assert.ok(ACCESS_CONTROL_SESSION_STATE_FIXTURES.REVOKED_SESSION_ID);

  assert.equal(ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES.ACTIVE, 'active');
  assert.equal(ACCESS_CONTROL_ACCOUNT_STATUS_FIXTURES.BLOCKED, 'blocked');

  assert.equal(modelAccessControlResult({ statusCode: 401 }).allowed, false);
  assert.equal(
    ACCESS_CONTROL_DENY_ERROR_CODES.SESSION_REVOKED,
    ERROR_CODES.SESSION_REVOKED,
  );
});
