import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { requireRole } from '../../../modules/auth/middlewares/require-role.middleware';
import { hasPermission } from '../../../modules/auth/services/permission.service';
import {
  ACCESS_CONTROL_FIXTURE_PERMISSIONS,
  ACCESS_CONTROL_TEST_USERS,
  createMockAuthenticatedRequest,
  runAccessControlMiddleware,
} from '../index';

test('customer and delivery surfaces cannot access admin-only role gates', async () => {
  const adminOnly = requireRole([
    AUTH_ROLE.SUPPORT_ADMIN,
    AUTH_ROLE.OPERATIONS_ADMIN,
    AUTH_ROLE.SUPER_ADMIN,
  ]);

  const customerDenied = await runAccessControlMiddleware(
    adminOnly,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER]),
  );
  assert.equal(customerDenied.allowed, false);

  const deliveryDenied = await runAccessControlMiddleware(
    adminOnly,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.DELIVERY_AGENT]),
  );
  assert.equal(deliveryDenied.allowed, false);
});

test('vendor surfaces cannot access customer-only role gates', async () => {
  const customerOnly = requireRole([AUTH_ROLE.CUSTOMER]);

  const vendorDenied = await runAccessControlMiddleware(
    customerOnly,
    createMockAuthenticatedRequest(ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.VENDOR_OWNER]),
  );
  assert.equal(vendorDenied.allowed, false);
});

test('surface fixtures expose expected self-service and admin permissions', () => {
  const customer = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.CUSTOMER];
  const vendor = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.VENDOR_OWNER];
  const superAdmin = ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPER_ADMIN];

  assert.equal(
    hasPermission({
      userPermissions: customer.permissions,
      requiredPermission: ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.CUSTOMER_READ_SELF,
    }),
    true,
  );
  assert.equal(
    hasPermission({
      userPermissions: customer.permissions,
      requiredPermission: ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.AUTH_MANAGE,
    }),
    false,
  );

  assert.equal(
    hasPermission({
      userPermissions: vendor.permissions,
      requiredPermission: ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.VENDOR_READ_STORE,
    }),
    true,
  );
  assert.equal(
    hasPermission({
      userPermissions: vendor.permissions,
      requiredPermission: ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ,
    }),
    false,
  );

  assert.equal(
    hasPermission({
      userPermissions: superAdmin.permissions,
      requiredPermission: ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.WILDCARD,
    }),
    true,
  );
});
