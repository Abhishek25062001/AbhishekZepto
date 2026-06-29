import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
  WILDCARD_PERMISSION,
} from '../../modules/auth/constants/auth-permission.constants';
import { createPermissionCode } from '../../modules/auth/utils/permission-code.util';
import {
  developmentAuthUserSeedMatrix,
} from './seed-auth-users';
import { systemRoleSeedMatrix } from './seed-roles';

const findRoleSeed = (roleCode: string) => {
  const role = systemRoleSeedMatrix.find((item) => item.code === roleCode);
  assert.ok(role, `Expected seeded role ${roleCode} to exist`);
  return role;
};

const findDevUserSeed = (roleCode: string) => {
  const user = developmentAuthUserSeedMatrix.find((item) => item.role === roleCode);
  assert.ok(user, `Expected seeded auth user for role ${roleCode} to exist`);
  return user;
};

test('seeded role matrix includes every expected Phase 2 auth role', () => {
  assert.deepEqual(
    systemRoleSeedMatrix.map((role) => role.code),
    [
      AUTH_ROLE.CUSTOMER,
      AUTH_ROLE.DELIVERY_AGENT,
      AUTH_ROLE.VENDOR_OWNER,
      AUTH_ROLE.STORE_MANAGER,
      AUTH_ROLE.STORE_STAFF,
      AUTH_ROLE.SUPPORT_ADMIN,
      AUTH_ROLE.OPERATIONS_ADMIN,
      AUTH_ROLE.SUPER_ADMIN,
    ],
  );
});

test('super_admin seed keeps wildcard access', () => {
  const superAdmin = findRoleSeed(AUTH_ROLE.SUPER_ADMIN);
  assert.deepEqual(superAdmin.permissions, [WILDCARD_PERMISSION]);
});

test('operations_admin seed includes current admin mutation permission gate', () => {
  const operationsAdmin = findRoleSeed(AUTH_ROLE.OPERATIONS_ADMIN);

  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.SETTINGS,
        AUTH_PERMISSION_ACTION.MANAGE,
      ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.FINANCE,
        AUTH_PERMISSION_ACTION.READ,
      ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.FINANCE_PAYMENTS,
        AUTH_PERMISSION_ACTION.READ,
      ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER, AUTH_PERMISSION_ACTION.READ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER,
        AUTH_PERMISSION_ACTION.MANAGE_ACCOUNTS,
      ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER, AUTH_PERMISSION_ACTION.REVERSE),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.CATALOG, AUTH_PERMISSION_ACTION.CREATE),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.CATALOG, AUTH_PERMISSION_ACTION.UPDATE),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.CATALOG, AUTH_PERMISSION_ACTION.DELETE),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.CATALOG, AUTH_PERMISSION_ACTION.APPROVE),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.LOCATIONS, AUTH_PERMISSION_ACTION.CREATE),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.STORES, AUTH_PERMISSION_ACTION.DELETE),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS, AUTH_PERMISSION_ACTION.READ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
        AUTH_PERMISSION_ACTION.BULK_UPDATE,
      ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.INVENTORY, AUTH_PERMISSION_ACTION.ADJUST),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.INVENTORY,
        AUTH_PERMISSION_ACTION.BULK_UPDATE,
      ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.AUDIT_LOGS, AUTH_PERMISSION_ACTION.READ),
    ),
  );
  assert.ok(
    operationsAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.REPORTS, AUTH_PERMISSION_ACTION.READ),
    ),
  );
});

test('reports permissions are seeded as read-only operational analytics access', () => {
  const operationsAdmin = findRoleSeed(AUTH_ROLE.OPERATIONS_ADMIN);
  const supportAdmin = findRoleSeed(AUTH_ROLE.SUPPORT_ADMIN);
  const vendorOwner = findRoleSeed(AUTH_ROLE.VENDOR_OWNER);
  const reportsReadPermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.REPORTS,
    AUTH_PERMISSION_ACTION.READ,
  );
  const reportsManagePermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.REPORTS,
    AUTH_PERMISSION_ACTION.MANAGE,
  );

  assert.ok(operationsAdmin.permissions.includes(reportsReadPermission));
  assert.equal(operationsAdmin.permissions.includes(reportsManagePermission), false);
  assert.equal(supportAdmin.permissions.includes(reportsReadPermission), false);
  assert.equal(vendorOwner.permissions.includes(reportsReadPermission), false);
});

test('reports export permission is limited to operational export admins', () => {
  const operationsAdmin = findRoleSeed(AUTH_ROLE.OPERATIONS_ADMIN);
  const supportAdmin = findRoleSeed(AUTH_ROLE.SUPPORT_ADMIN);
  const vendorOwner = findRoleSeed(AUTH_ROLE.VENDOR_OWNER);
  const storeManager = findRoleSeed(AUTH_ROLE.STORE_MANAGER);
  const reportsExportPermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.REPORTS,
    AUTH_PERMISSION_ACTION.EXPORT,
  );

  assert.ok(operationsAdmin.permissions.includes(reportsExportPermission));
  assert.equal(supportAdmin.permissions.includes(reportsExportPermission), false);
  assert.equal(vendorOwner.permissions.includes(reportsExportPermission), false);
  assert.equal(storeManager.permissions.includes(reportsExportPermission), false);
});

test('audit log permissions are seeded as read-only operational oversight', () => {
  const operationsAdmin = findRoleSeed(AUTH_ROLE.OPERATIONS_ADMIN);
  const supportAdmin = findRoleSeed(AUTH_ROLE.SUPPORT_ADMIN);
  const vendorOwner = findRoleSeed(AUTH_ROLE.VENDOR_OWNER);
  const auditLogReadPermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.AUDIT_LOGS,
    AUTH_PERMISSION_ACTION.READ,
  );
  const auditLogManagePermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.AUDIT_LOGS,
    AUTH_PERMISSION_ACTION.MANAGE,
  );

  assert.ok(operationsAdmin.permissions.includes(auditLogReadPermission));
  assert.equal(operationsAdmin.permissions.includes(auditLogManagePermission), false);
  assert.equal(supportAdmin.permissions.includes(auditLogReadPermission), false);
  assert.equal(vendorOwner.permissions.includes(auditLogReadPermission), false);
});

test('platform settings permissions are seeded for admin settings access only', () => {
  const operationsAdmin = findRoleSeed(AUTH_ROLE.OPERATIONS_ADMIN);
  const supportAdmin = findRoleSeed(AUTH_ROLE.SUPPORT_ADMIN);
  const vendorOwner = findRoleSeed(AUTH_ROLE.VENDOR_OWNER);
  const settingsReadPermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.SETTINGS,
    AUTH_PERMISSION_ACTION.READ,
  );
  const settingsManagePermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.SETTINGS,
    AUTH_PERMISSION_ACTION.MANAGE,
  );

  assert.ok(supportAdmin.permissions.includes(settingsReadPermission));
  assert.equal(supportAdmin.permissions.includes(settingsManagePermission), false);
  assert.ok(operationsAdmin.permissions.includes(settingsManagePermission));
  assert.ok(vendorOwner.permissions.includes(settingsManagePermission));
});

test('support_admin seed remains limited to support/read-oriented permissions', () => {
  const supportAdmin = findRoleSeed(AUTH_ROLE.SUPPORT_ADMIN);

  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SUPPORT, AUTH_PERMISSION_ACTION.READ),
    ),
  );
  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SUPPORT, AUTH_PERMISSION_ACTION.CREATE),
    ),
  );
  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SUPPORT, AUTH_PERMISSION_ACTION.UPDATE),
    ),
  );
  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SUPPORT, AUTH_PERMISSION_ACTION.ASSIGN),
    ),
  );
  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.USERS, AUTH_PERMISSION_ACTION.READ),
    ),
  );
  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.READ),
    ),
  );
  assert.equal(
    supportAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.SETTINGS,
        AUTH_PERMISSION_ACTION.MANAGE,
      ),
    ),
    false,
  );
  assert.equal(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.FINANCE, AUTH_PERMISSION_ACTION.READ),
    ),
    false,
  );
  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(
        AUTH_PERMISSION_RESOURCE.FINANCE_PAYMENTS,
        AUTH_PERMISSION_ACTION.READ,
      ),
    ),
  );
  assert.ok(
    supportAdmin.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.FINANCE_LEDGER, AUTH_PERMISSION_ACTION.READ),
    ),
  );
});

test('non-admin roles do not receive users:read or wildcard', () => {
  const disallowedAdminReadPermission = createPermissionCode(
    AUTH_PERMISSION_RESOURCE.USERS,
    AUTH_PERMISSION_ACTION.READ,
  );

  for (const roleCode of [
    AUTH_ROLE.CUSTOMER,
    AUTH_ROLE.DELIVERY_AGENT,
    AUTH_ROLE.VENDOR_OWNER,
    AUTH_ROLE.STORE_MANAGER,
    AUTH_ROLE.STORE_STAFF,
  ]) {
    const role = findRoleSeed(roleCode);
    assert.equal(role.permissions.includes(disallowedAdminReadPermission), false);
    assert.equal(role.permissions.includes(WILDCARD_PERMISSION), false);
  }
});

test('vendor and store roles keep current storefront-scoped permissions', () => {
  const vendorOwner = findRoleSeed(AUTH_ROLE.VENDOR_OWNER);
  const storeManager = findRoleSeed(AUTH_ROLE.STORE_MANAGER);
  const storeStaff = findRoleSeed(AUTH_ROLE.STORE_STAFF);

  assert.ok(
    vendorOwner.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.MANAGE),
    ),
  );
  assert.equal(
    storeManager.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.MANAGE),
    ),
    false,
  );
  assert.equal(
    storeStaff.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.MANAGE),
    ),
    false,
  );
  assert.ok(
    vendorOwner.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS, AUTH_PERMISSION_ACTION.READ),
    ),
  );
  assert.ok(
    storeManager.permissions.includes(
      createPermissionCode(AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS, AUTH_PERMISSION_ACTION.UPDATE),
    ),
  );
});

test('development auth user seeds keep expected explicit permission defaults', () => {
  const customer = findDevUserSeed(AUTH_ROLE.CUSTOMER);
  const deliveryAgent = findDevUserSeed(AUTH_ROLE.DELIVERY_AGENT);
  const vendorOwner = findDevUserSeed(AUTH_ROLE.VENDOR_OWNER);
  const superAdmin = findDevUserSeed(AUTH_ROLE.SUPER_ADMIN);

  assert.deepEqual(customer.permissions ?? [], []);
  assert.deepEqual(deliveryAgent.permissions ?? [], []);
  assert.deepEqual(vendorOwner.permissions ?? [], []);
  assert.deepEqual(superAdmin.permissions ?? [], [WILDCARD_PERMISSION]);
});
