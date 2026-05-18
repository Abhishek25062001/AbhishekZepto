import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { PermissionCode } from '../types/auth-permission.types';
import {
  buildTenantScopeAuditMetadata,
  canUseTenantAdminOverride,
  getTenantAuditEventType,
  isAdminScopeOverrideSupported,
} from './scope-access.service';

test('canUseTenantAdminOverride allows current admin override for customer and delivery_agent only', () => {
  const adminUser = {
    userId: '68295cf6d5cc8fddf6b8d210',
    role: 'support_admin' as const,
    permissions: ['users:read'] as PermissionCode[],
    sessionId: 'session-1',
    vendorId: null,
    storeId: null,
    cityId: null,
  };

  assert.equal(
    canUseTenantAdminOverride({
      user: adminUser,
      targetKind: 'customer',
    }),
    true,
  );
  assert.equal(
    canUseTenantAdminOverride({
      user: adminUser,
      targetKind: 'delivery_agent',
    }),
    true,
  );
  assert.equal(
    canUseTenantAdminOverride({
      user: adminUser,
      targetKind: 'vendor',
    }),
    false,
  );
  assert.equal(isAdminScopeOverrideSupported('customer'), true);
  assert.equal(isAdminScopeOverrideSupported('vendor'), false);
});

test('buildTenantScopeAuditMetadata includes requestedScope allowedScope and overridePermission safely', () => {
  assert.deepEqual(
    buildTenantScopeAuditMetadata({
      kind: 'customer',
      field: 'customerId',
      requestedValue: 'customer-1',
      userScope: {
        userId: 'customer-2',
        vendorId: null,
        storeId: null,
        cityId: null,
      },
      reason: 'scope_mismatch',
      overridePermission: 'users:read',
    }),
    {
      scopeKind: 'customer',
      field: 'customerId',
      reason: 'scope_mismatch',
      requestedScope: {
        customerId: 'customer-1',
      },
      allowedScope: {
        vendorId: null,
        storeId: null,
        cityId: null,
        customerId: 'customer-2',
        deliveryAgentId: null,
        overridePermission: 'users:read',
      },
    },
  );
});

test('getTenantAuditEventType maps scope reasons to explicit tenant audit events', () => {
  assert.equal(getTenantAuditEventType('missing_scope'), 'security.tenant_access_denied');
  assert.equal(getTenantAuditEventType('access_denied'), 'security.tenant_access_denied');
  assert.equal(getTenantAuditEventType('scope_mismatch'), 'security.tenant_scope_mismatch');
  assert.equal(
    getTenantAuditEventType('admin_override'),
    'security.tenant_admin_override_used',
  );
});
