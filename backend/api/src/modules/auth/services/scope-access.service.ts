import { Types } from 'mongoose';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../constants/auth-permission.constants';
import type { AuthRole } from '../types/auth-role.types';
import type {
  AuthScopeContext,
  AuthScopeField,
  AuthScopeKind,
  ResolvedAuthScope,
} from '../types/auth-scope.types';
import { hasAnyPermission } from './permission.service';
import { createPermissionCode } from '../utils/permission-code.util';
import { AUDIT_EVENTS, type AuditActorSurface } from '../../audit';

const usersReadPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.USERS,
  AUTH_PERMISSION_ACTION.READ,
);

const normalizeScopeValue = (value?: string | null): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const toScopeAuditObjectIdOrNull = (
  value?: string | null,
): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

export const getAuditActorSurfaceForRole = (
  role: AuthRole,
): AuditActorSurface => {
  if (role === 'customer') {
    return 'customer_app';
  }

  if (role === 'delivery_agent') {
    return 'delivery_agent_app';
  }

  if (
    role === 'vendor_owner' ||
    role === 'store_manager' ||
    role === 'store_staff'
  ) {
    return 'vendor_panel';
  }

  return 'admin_dashboard';
};

export const normalizeAuthScope = (
  scope: AuthScopeContext,
): ResolvedAuthScope => {
  return {
    vendorId: normalizeScopeValue(scope.vendorId),
    storeId: normalizeScopeValue(scope.storeId),
    cityId: normalizeScopeValue(scope.cityId),
  };
};

export const resolveEffectiveAuthScope = ({
  identityScope,
  tokenScope,
}: {
  identityScope: AuthScopeContext;
  tokenScope?: AuthScopeContext;
}): ResolvedAuthScope => {
  const normalizedIdentityScope = normalizeAuthScope(identityScope);
  const normalizedTokenScope = normalizeAuthScope(tokenScope ?? {});

  return {
    vendorId:
      normalizedIdentityScope.vendorId ?? normalizedTokenScope.vendorId,
    storeId: normalizedIdentityScope.storeId ?? normalizedTokenScope.storeId,
    cityId: normalizedIdentityScope.cityId ?? normalizedTokenScope.cityId,
  };
};

const getAllowedScopeFromUser = (scope: AuthScopeContext) => {
  return {
    vendorId: normalizeScopeValue(scope.vendorId),
    storeId: normalizeScopeValue(scope.storeId),
    cityId: normalizeScopeValue(scope.cityId),
  };
};

const getRequestedScopeShape = ({
  field,
  value,
}: {
  field: AuthScopeField | 'customerId' | 'deliveryAgentId';
  value?: string | null;
}) => {
  return {
    [field]: normalizeScopeValue(value),
  };
};

export const buildTenantScopeAuditMetadata = ({
  kind,
  field,
  requestedValue,
  userScope,
  reason,
  overridePermission,
}: {
  kind: AuthScopeKind | 'customer' | 'delivery_agent';
  field: AuthScopeField | 'customerId' | 'deliveryAgentId';
  requestedValue?: string | null;
  userScope: AuthScopeContext & {
    userId?: string | null;
  };
  reason:
    | 'missing_scope'
    | 'scope_mismatch'
    | 'access_denied'
    | 'admin_override';
  overridePermission?: string | null;
}) => {
  const allowedScope = {
    ...getAllowedScopeFromUser(userScope),
    customerId:
      userScope.userId && field === 'customerId' ? normalizeScopeValue(userScope.userId) : null,
    deliveryAgentId:
      userScope.userId && field === 'deliveryAgentId'
        ? normalizeScopeValue(userScope.userId)
        : null,
    overridePermission: overridePermission ?? null,
  };

  return {
    scopeKind: kind,
    field,
    reason,
    requestedScope: getRequestedScopeShape({
      field,
      value: requestedValue,
    }),
    allowedScope,
  };
};

export const canUseTenantAdminOverride = ({
  user,
  targetKind,
}: {
  user: Express.Request['user'];
  targetKind: 'customer' | 'delivery_agent' | 'vendor' | 'store' | 'city';
}): boolean => {
  if (!user) {
    return false;
  }

  if (
    user.role !== 'support_admin' &&
    user.role !== 'operations_admin' &&
    user.role !== 'super_admin'
  ) {
    return false;
  }

  if (targetKind !== 'customer' && targetKind !== 'delivery_agent') {
    return false;
  }

  return hasAnyPermission({
    userPermissions: user.permissions,
    requiredPermissions: [usersReadPermission],
  });
};

export const isAdminScopeOverrideSupported = (
  targetKind: 'customer' | 'delivery_agent' | 'vendor' | 'store' | 'city',
): boolean => {
  return targetKind === 'customer' || targetKind === 'delivery_agent';
};

export const getTenantAuditEventType = (
  reason: 'missing_scope' | 'scope_mismatch' | 'access_denied' | 'admin_override',
) => {
  if (reason === 'scope_mismatch') {
    return AUDIT_EVENTS.TENANT_SCOPE_MISMATCH;
  }

  if (reason === 'admin_override') {
    return AUDIT_EVENTS.TENANT_ADMIN_OVERRIDE_USED;
  }

  return AUDIT_EVENTS.TENANT_ACCESS_DENIED;
};
