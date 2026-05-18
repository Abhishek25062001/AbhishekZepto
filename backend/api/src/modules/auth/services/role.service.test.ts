import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { DB_STATUS } from '../../../database/constants/db-status.constants';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../constants/auth-role.constants';
import type { RoleRecord } from '../models/role.model';
import type { PermissionCode } from '../types/auth-permission.types';
import { createRole, deleteRole, updateRole } from './role.service';
import * as roleRepositoryModule from '../repositories/role.repository';

type RoleRepositoryModule = {
  findRoleById: (roleId: string) => Promise<RoleRecord | null>;
  roleExistsByCode: (code: RoleRecord['code']) => Promise<unknown>;
  createRole: (
    input: Pick<
      RoleRecord,
      'code' | 'name' | 'description' | 'permissions' | 'isSystemRole' | 'isEditable'
    >,
  ) => Promise<RoleRecord>;
  updateRoleById: (
    roleId: string,
    input: Partial<
      Pick<RoleRecord, 'name' | 'description' | 'permissions' | 'isEditable' | 'status'>
    >,
  ) => Promise<RoleRecord | null>;
  softDeleteRoleById: (roleId: string) => Promise<RoleRecord | null>;
};

const roleRepository = roleRepositoryModule as unknown as RoleRepositoryModule;

const originalRoleRepository: RoleRepositoryModule = {
  findRoleById: roleRepository.findRoleById,
  roleExistsByCode: roleRepository.roleExistsByCode,
  createRole: roleRepository.createRole,
  updateRoleById: roleRepository.updateRoleById,
  softDeleteRoleById: roleRepository.softDeleteRoleById,
};

const buildRoleRecord = (
  overrides: Partial<RoleRecord> = {},
): RoleRecord => ({
  code: AUTH_ROLE.SUPPORT_ADMIN,
  name: 'Support Admin',
  description: null,
  permissions: ['orders:read'],
  isSystemRole: false,
  isEditable: true,
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
  roleRepository.findRoleById = originalRoleRepository.findRoleById;
  roleRepository.roleExistsByCode = originalRoleRepository.roleExistsByCode;
  roleRepository.createRole = originalRoleRepository.createRole;
  roleRepository.updateRoleById = originalRoleRepository.updateRoleById;
  roleRepository.softDeleteRoleById = originalRoleRepository.softDeleteRoleById;
});

test('createRole succeeds with normalized permissions', async () => {
  let capturedPermissions: PermissionCode[] = [];

  roleRepository.roleExistsByCode = async () => null;
  roleRepository.createRole = async (input) => {
    capturedPermissions = input.permissions;
    return buildRoleRecord(input);
  };

  const createdRole = await createRole({
    code: AUTH_ROLE.SUPPORT_ADMIN,
    name: 'Support Admin',
    description: null,
    permissions: ['orders:read', 'orders:read'],
    isSystemRole: false,
    isEditable: true,
  });

  assert.deepEqual(capturedPermissions, ['orders:read']);
  assert.equal(createdRole.name, 'Support Admin');
  assert.equal(createdRole.isEditable, true);
});

test('createRole blocks duplicate role codes', async () => {
  roleRepository.roleExistsByCode = async () => ({ _id: 'existing-role' });

  await assert.rejects(
    () =>
      createRole({
        code: AUTH_ROLE.SUPPORT_ADMIN,
        name: 'Support Admin',
        description: null,
        permissions: ['orders:read'],
        isSystemRole: false,
        isEditable: true,
      }),
    (error: unknown) => isAppErrorWithCode(error, ERROR_CODES.CONFLICT),
  );
});

test('updateRole blocks mutation of a non-editable system role', async () => {
  let updateAttempted = false;

  roleRepository.findRoleById = async () =>
    buildRoleRecord({
      code: AUTH_ROLE.SUPER_ADMIN,
      isSystemRole: true,
      isEditable: false,
    });
  roleRepository.updateRoleById = async () => {
    updateAttempted = true;
    return null;
  };

  await assert.rejects(
    () =>
      updateRole('locked-role-id', {
        name: 'Renamed Role',
      }),
    (error: unknown) => isAppErrorWithCode(error, ERROR_CODES.FORBIDDEN),
  );

  assert.equal(updateAttempted, false);
});

test('deleteRole blocks deletion of a non-editable system role', async () => {
  let deleteAttempted = false;

  roleRepository.findRoleById = async () =>
    buildRoleRecord({
      code: AUTH_ROLE.SUPER_ADMIN,
      isSystemRole: true,
      isEditable: false,
    });
  roleRepository.softDeleteRoleById = async () => {
    deleteAttempted = true;
    return null;
  };

  await assert.rejects(
    () => deleteRole('locked-role-id'),
    (error: unknown) => isAppErrorWithCode(error, ERROR_CODES.FORBIDDEN),
  );

  assert.equal(deleteAttempted, false);
});

test('createRole rejects wildcard permission for non-system roles', async () => {
  roleRepository.roleExistsByCode = async () => null;

  await assert.rejects(
    () =>
      createRole({
        code: AUTH_ROLE.SUPPORT_ADMIN,
        name: 'Support Admin',
        description: null,
        permissions: ['*:*'],
        isSystemRole: false,
        isEditable: true,
      }),
    (error: unknown) => isAppErrorWithCode(error, ERROR_CODES.VALIDATION_ERROR),
  );
});
