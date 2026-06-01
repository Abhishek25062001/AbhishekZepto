import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { ERROR_CODES } from '../../../errors/error-codes';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import { ADMIN_USER_PERMISSION_GROUPS } from '../constants/admin-user-permissions.constants';
import {
  adminUserIdParamValidator,
  adminUserPermissionsValidator,
  adminUserRoleValidator,
  adminUserStatusValidator,
  createAdminUserValidator,
  listAdminUsersQueryValidator,
} from '../validators/admin-user.validator';

const routeSource = (): string => {
  return readFileSync(
    resolve(process.cwd(), 'backend/api/src/modules/admin-users/routes/admin-user.routes.ts'),
    'utf8',
  );
};

test('admin user management routes expose planned endpoints', () => {
  const source = routeSource();

  assert.match(source, /router\.post\('\/'/);
  assert.match(source, /router\.get\('\/'/);
  assert.match(source, /router\.get\('\/:adminUserId'/);
  assert.match(source, /router\.patch\('\/:adminUserId'/);
  assert.match(source, /router\.patch\('\/:adminUserId\/status'/);
  assert.match(source, /router\.patch\('\/:adminUserId\/roles'/);
  assert.match(source, /router\.patch\('\/:adminUserId\/permissions'/);
  assert.match(source, /router\.get\('\/:adminUserId\/audit'/);
});

test('create admin user validator accepts documented payload', () => {
  const permissions = [createPermissionCode('users', 'read')];
  const parsed = createAdminUserValidator.body.parse({
    phone: '+15555550100',
    email: 'ops@example.com',
    name: 'Ops Admin',
    role: AUTH_ROLE.OPERATIONS_ADMIN,
    permissions,
    cityScope: ['507f1f77bcf86cd799439011'],
    storeScope: [],
  });

  assert.equal(parsed.role, AUTH_ROLE.OPERATIONS_ADMIN);
  assert.deepEqual(parsed.permissions, permissions);
});

test('admin user validators reject invalid ids and accept list filters', () => {
  assert.throws(() => adminUserIdParamValidator.params.parse({ adminUserId: 'bad-id' }));

  const parsed = listAdminUsersQueryValidator.query.parse({
    role: AUTH_ROLE.SUPPORT_ADMIN,
    status: 'active',
    page: '2',
    limit: '10',
  });

  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 10);
});

test('admin user permission groups expose documented gates', () => {
  assert.ok(ADMIN_USER_PERMISSION_GROUPS.CREATE.includes(createPermissionCode('users', 'create')));
  assert.ok(ADMIN_USER_PERMISSION_GROUPS.READ.includes(createPermissionCode('users', 'read')));
  assert.ok(ADMIN_USER_PERMISSION_GROUPS.UPDATE.includes(createPermissionCode('users', 'update')));
  assert.ok(ADMIN_USER_PERMISSION_GROUPS.ROLE.includes(createPermissionCode('settings', 'manage')));
  assert.ok(ADMIN_USER_PERMISSION_GROUPS.PERMISSIONS.includes(createPermissionCode('settings', 'manage')));
});

test('sensitive admin user validators require reason capture', () => {
  assert.throws(() => adminUserStatusValidator.body.parse({ status: 'inactive' }));
  assert.throws(() => adminUserRoleValidator.body.parse({ role: AUTH_ROLE.SUPPORT_ADMIN }));
  assert.throws(() => adminUserPermissionsValidator.body.parse({ permissions: [] }));

  assert.equal(
    adminUserStatusValidator.body.parse({ status: 'inactive', reason: 'Access removed' }).reason,
    'Access removed',
  );
});

test('admin user error codes expose documented boundaries', () => {
  assert.equal(ERROR_CODES.ADMIN_USER_NOT_FOUND, 'ADMIN_USER_NOT_FOUND');
  assert.equal(ERROR_CODES.ADMIN_USER_ALREADY_EXISTS, 'ADMIN_USER_ALREADY_EXISTS');
  assert.equal(ERROR_CODES.INVALID_ADMIN_ROLE, 'INVALID_ADMIN_ROLE');
  assert.equal(ERROR_CODES.ADMIN_USER_SELF_DISABLE_DENIED, 'ADMIN_USER_SELF_DISABLE_DENIED');
  assert.equal(ERROR_CODES.ADMIN_USER_SELF_ROLE_CHANGE_DENIED, 'ADMIN_USER_SELF_ROLE_CHANGE_DENIED');
  assert.equal(ERROR_CODES.ADMIN_USER_SELF_PERMISSION_CHANGE_DENIED, 'ADMIN_USER_SELF_PERMISSION_CHANGE_DENIED');
});

test('admin user audit action types are registered', async () => {
  const { ADMIN_ACTION_TYPE } = await import('../../admin-control/constants/admin-action-types');

  assert.equal(ADMIN_ACTION_TYPE.ADMIN_USER_CREATED, 'ADMIN_USER_CREATED');
  assert.equal(ADMIN_ACTION_TYPE.ADMIN_USER_UPDATED, 'ADMIN_USER_UPDATED');
  assert.equal(ADMIN_ACTION_TYPE.ADMIN_USER_STATUS_CHANGED, 'ADMIN_USER_STATUS_CHANGED');
  assert.equal(ADMIN_ACTION_TYPE.ADMIN_USER_ROLE_CHANGED, 'ADMIN_USER_ROLE_CHANGED');
  assert.equal(ADMIN_ACTION_TYPE.ADMIN_USER_PERMISSIONS_CHANGED, 'ADMIN_USER_PERMISSIONS_CHANGED');
});
