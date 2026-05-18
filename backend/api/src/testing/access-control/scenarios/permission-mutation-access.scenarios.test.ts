import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../../modules/auth/constants/auth-role.constants';
import { AUTH_ACCOUNT_STATUS } from '../../../modules/auth/constants/auth-status.constants';
import { DB_STATUS } from '../../../database/constants/db-status.constants';
import * as roleRepositoryModule from '../../../modules/auth/repositories/role.repository';
import * as userIdentityRepositoryModule from '../../../modules/auth/repositories/user-identity.repository';
import {
  assignUserRole,
  syncUserPermissionsFromRole,
  updateUserPermissions,
} from '../../../modules/auth/services/user-permission.service';
import {
  ACCESS_CONTROL_FIXTURE_PERMISSIONS,
  ACCESS_CONTROL_TEST_USERS,
  evaluateAccessControlAction,
} from '../index';

const userIdentityRepository = userIdentityRepositoryModule as unknown as {
  findActiveUserIdentityById: (userId: string) => Promise<Record<string, unknown> | null>;
  updateUserPermissions: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
  assignUserRole: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

const roleRepository = roleRepositoryModule as unknown as {
  findRoleByCode: (roleCode: string) => Promise<Record<string, unknown> | null>;
};

const originals = {
  findActiveUserIdentityById: userIdentityRepository.findActiveUserIdentityById,
  updateUserPermissions: userIdentityRepository.updateUserPermissions,
  assignUserRole: userIdentityRepository.assignUserRole,
  findRoleByCode: roleRepository.findRoleByCode,
};

const buildUser = (role: (typeof AUTH_ROLE)[keyof typeof AUTH_ROLE]) => ({
  phone: ACCESS_CONTROL_TEST_USERS[role].phone,
  email: null,
  name: 'Access Control User',
  role,
  accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
  permissions: [...ACCESS_CONTROL_TEST_USERS[role].permissions],
  vendorId: ACCESS_CONTROL_TEST_USERS[role].vendorId,
  storeId: ACCESS_CONTROL_TEST_USERS[role].storeId,
  cityId: ACCESS_CONTROL_TEST_USERS[role].cityId,
  lastLoginAt: null,
  createdBy: null,
  updatedBy: null,
  status: DB_STATUS.ACTIVE,
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

afterEach(() => {
  userIdentityRepository.findActiveUserIdentityById = originals.findActiveUserIdentityById;
  userIdentityRepository.updateUserPermissions = originals.updateUserPermissions;
  userIdentityRepository.assignUserRole = originals.assignUserRole;
  roleRepository.findRoleByCode = originals.findRoleByCode;
});

test('operations admin permission mutation normalizes duplicates', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () =>
    buildUser(AUTH_ROLE.OPERATIONS_ADMIN);
  userIdentityRepository.updateUserPermissions = async () =>
    buildUser(AUTH_ROLE.OPERATIONS_ADMIN);

  const result = await evaluateAccessControlAction(async () => {
    await updateUserPermissions({
      userId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.OPERATIONS_ADMIN].userId,
      permissions: [
        ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ,
        ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ,
      ],
    });
  });

  assert.equal(result.allowed, true);
});

test('permission mutation blocks wildcard grants for non-super-admin users', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () =>
    buildUser(AUTH_ROLE.SUPPORT_ADMIN);

  const result = await evaluateAccessControlAction(async () => {
    await updateUserPermissions({
      userId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN].userId,
      permissions: [ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.WILDCARD],
    });
  });

  assert.equal(result.allowed, false);
  assert.equal(result.errorCode, ERROR_CODES.VALIDATION_ERROR);
});

test('role assignment and sync mutations succeed for allowed roles', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () =>
    buildUser(AUTH_ROLE.SUPPORT_ADMIN);
  userIdentityRepository.assignUserRole = async ({ role }) => buildUser(role as typeof AUTH_ROLE.SUPPORT_ADMIN);
  roleRepository.findRoleByCode = async () => ({
    permissions: [ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ],
  });
  userIdentityRepository.updateUserPermissions = async () =>
    buildUser(AUTH_ROLE.OPERATIONS_ADMIN);

  const assignResult = await evaluateAccessControlAction(async () => {
    const updated = await assignUserRole({
      userId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN].userId,
      role: AUTH_ROLE.OPERATIONS_ADMIN,
    });
    assert.equal(updated.role, AUTH_ROLE.OPERATIONS_ADMIN);
  });
  assert.equal(assignResult.allowed, true);

  const syncResult = await evaluateAccessControlAction(async () => {
    const synced = await syncUserPermissionsFromRole({
      userId: ACCESS_CONTROL_TEST_USERS[AUTH_ROLE.SUPPORT_ADMIN].userId,
      roleCode: AUTH_ROLE.OPERATIONS_ADMIN,
    });
    assert.ok(synced.permissions.includes(ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ));
  });
  assert.equal(syncResult.allowed, true);
});

test('permission mutation rejects unknown users', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () => null;

  const result = await evaluateAccessControlAction(async () => {
    await updateUserPermissions({
      userId: '000000000000000000000000',
      permissions: [ACCESS_CONTROL_FIXTURE_PERMISSIONS.VALID.USERS_READ],
    });
  });

  assert.equal(result.allowed, false);
  assert.equal(result.errorCode, ERROR_CODES.NOT_FOUND);
});
