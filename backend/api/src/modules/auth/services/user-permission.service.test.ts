import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import type { Types } from 'mongoose';
import { DB_STATUS } from '../../../database/constants/db-status.constants';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ACCOUNT_STATUS } from '../constants/auth-status.constants';
import { AUTH_ROLE } from '../constants/auth-role.constants';
import type { UserIdentityRecord } from '../models/user-identity.model';
import * as roleRepositoryModule from '../repositories/role.repository';
import * as userIdentityRepositoryModule from '../repositories/user-identity.repository';
import {
  assignUserRole,
  syncUserPermissionsFromRole,
  updateUserPermissions,
} from './user-permission.service';

type UserIdentityRepositoryModule = {
  findActiveUserIdentityById: (userId: string) => Promise<UserIdentityRecord | null>;
  updateUserPermissions: ({
    userId,
    permissions,
    updatedBy,
  }: {
    userId: string;
    permissions: string[];
    updatedBy?: Types.ObjectId | null;
  }) => Promise<UserIdentityRecord | null>;
  assignUserRole: ({
    userId,
    role,
    updatedBy,
  }: {
    userId: string;
    role: UserIdentityRecord['role'];
    updatedBy?: Types.ObjectId | null;
  }) => Promise<UserIdentityRecord | null>;
};

type RoleRepositoryModule = {
  findRoleByCode: (code: UserIdentityRecord['role']) => Promise<{
    code: UserIdentityRecord['role'];
    name: string;
    description: string | null;
    permissions: string[];
    isSystemRole: boolean;
    isEditable: boolean;
    status: string;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
};

const userIdentityRepository =
  userIdentityRepositoryModule as unknown as UserIdentityRepositoryModule;
const roleRepository = roleRepositoryModule as unknown as RoleRepositoryModule;

const originalUserIdentityRepository: UserIdentityRepositoryModule = {
  findActiveUserIdentityById: userIdentityRepository.findActiveUserIdentityById,
  updateUserPermissions: userIdentityRepository.updateUserPermissions,
  assignUserRole: userIdentityRepository.assignUserRole,
};

const originalRoleRepository: RoleRepositoryModule = {
  findRoleByCode: roleRepository.findRoleByCode,
};

const buildUserIdentity = (
  overrides: Partial<UserIdentityRecord> = {},
): UserIdentityRecord => ({
  phone: '9999999999',
  email: null,
  name: 'Test User',
  role: AUTH_ROLE.SUPPORT_ADMIN,
  accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
  permissions: ['orders:read'],
  vendorId: null,
  storeId: null,
  cityId: null,
  lastLoginAt: null,
  createdBy: null,
  updatedBy: null,
  status: DB_STATUS.ACTIVE,
  isDeleted: false,
  deletedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

const isAppErrorWithCode = (error: unknown, code: string) => {
  return error instanceof AppError && error.errorCode === code;
};

afterEach(() => {
  userIdentityRepository.findActiveUserIdentityById =
    originalUserIdentityRepository.findActiveUserIdentityById;
  userIdentityRepository.updateUserPermissions =
    originalUserIdentityRepository.updateUserPermissions;
  userIdentityRepository.assignUserRole = originalUserIdentityRepository.assignUserRole;
  roleRepository.findRoleByCode = originalRoleRepository.findRoleByCode;
});

test('updateUserPermissions succeeds with normalized permissions', async () => {
  const updatedBy = null as Types.ObjectId | null;
  let capturedPermissions: string[] = [];

  userIdentityRepository.findActiveUserIdentityById = async () => buildUserIdentity();
  userIdentityRepository.updateUserPermissions = async ({
    permissions,
  }: {
    permissions: string[];
  }) => {
    capturedPermissions = permissions;

    return buildUserIdentity({
      permissions,
    });
  };

  const updatedUser = await updateUserPermissions({
    userId: '68295cf6d5cc8fddf6b8d201',
    permissions: ['orders:read', 'orders:read'],
    updatedBy,
  });

  assert.deepEqual(capturedPermissions, ['orders:read']);
  assert.deepEqual(updatedUser.permissions, ['orders:read']);
});

test('updateUserPermissions blocks wildcard for non-super-admin users', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () =>
    buildUserIdentity({
      role: AUTH_ROLE.SUPPORT_ADMIN,
    });

  await assert.rejects(
    () =>
      updateUserPermissions({
        userId: '68295cf6d5cc8fddf6b8d201',
        permissions: ['*:*'],
        updatedBy: null,
      }),
    (error: unknown) => isAppErrorWithCode(error, ERROR_CODES.VALIDATION_ERROR),
  );
});

test('assignUserRole updates the user role', async () => {
  userIdentityRepository.findActiveUserIdentityById = async () => buildUserIdentity();
  userIdentityRepository.assignUserRole = async ({
    role,
  }: {
    role: UserIdentityRecord['role'];
  }) =>
    buildUserIdentity({
      role,
    });

  const updatedUser = await assignUserRole({
    userId: '68295cf6d5cc8fddf6b8d201',
    role: AUTH_ROLE.OPERATIONS_ADMIN,
    updatedBy: null,
  });

  assert.equal(updatedUser.role, AUTH_ROLE.OPERATIONS_ADMIN);
});

test('syncUserPermissionsFromRole copies active role permissions to the user', async () => {
  let capturedPermissions: string[] = [];

  userIdentityRepository.findActiveUserIdentityById = async () => buildUserIdentity();
  roleRepository.findRoleByCode = async () => ({
    code: AUTH_ROLE.OPERATIONS_ADMIN,
    name: 'Operations Admin',
    description: null,
    permissions: ['orders:read', 'inventory:update'],
    isSystemRole: true,
    isEditable: false,
    status: DB_STATUS.ACTIVE,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  });
  userIdentityRepository.updateUserPermissions = async ({
    permissions,
  }: {
    permissions: string[];
  }) => {
    capturedPermissions = permissions;

    return buildUserIdentity({
      permissions,
    });
  };

  const updatedUser = await syncUserPermissionsFromRole({
    userId: '68295cf6d5cc8fddf6b8d201',
    roleCode: AUTH_ROLE.OPERATIONS_ADMIN,
    updatedBy: null,
  });

  assert.deepEqual(capturedPermissions, ['orders:read', 'inventory:update']);
  assert.deepEqual(updatedUser.permissions, ['orders:read', 'inventory:update']);
});
