import { writeAuditLog } from '../../audit';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import {
  getTenantAuditEventType,
  buildTenantScopeAuditMetadata,
  canUseTenantAdminOverride,
  getAuditActorSurfaceForRole,
  isAdminScopeOverrideSupported,
  toScopeAuditObjectIdOrNull,
} from '../../auth/services/scope-access.service';
import { hasAnyPermission } from '../../auth/services/permission.service';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  createTenantAccessTestRecord,
  findTenantAccessTestsByCustomer,
  findTenantAccessTestsByDeliveryAgent,
  findTenantAccessTestsByVendorStore,
  type CreateTenantAccessTestInput,
} from '../repositories/tenant-access-test.repository';

const customerSelfReadPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CUSTOMER,
  AUTH_PERMISSION_ACTION.READ_SELF,
);

const deliverySelfReadPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.DELIVERY,
  AUTH_PERMISSION_ACTION.READ_SELF,
);

const adminUsersReadPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.USERS,
  AUTH_PERMISSION_ACTION.READ,
);

type TenantAuditContext = {
  requestId?: string | null;
  traceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

const writeTenantAccessAudit = ({
  eventType,
  user,
  metadata,
  requestContext,
  status = 'failed',
}: {
  eventType: string;
  user: Express.Request['user'];
  metadata: Record<string, unknown>;
  requestContext?: TenantAuditContext;
  status?: 'success' | 'failed';
}) => {
  if (!user) {
    return;
  }

  void writeAuditLog({
    eventType,
    actorId: toScopeAuditObjectIdOrNull(user.userId),
    actorRole: user.role,
    actorSurface: getAuditActorSurfaceForRole(user.role),
    entityType: 'tenant_access_tests',
    entityId: null,
    vendorId: toScopeAuditObjectIdOrNull(user.vendorId),
    storeId: toScopeAuditObjectIdOrNull(user.storeId),
    cityId: toScopeAuditObjectIdOrNull(user.cityId),
    requestId: requestContext?.requestId ?? null,
    traceId: requestContext?.traceId ?? null,
    ipAddress: requestContext?.ipAddress ?? null,
    userAgent: requestContext?.userAgent ?? null,
    metadata,
    status,
  });
};

const isCustomerSelfReadAllowed = (user: Express.Request['user']) => {
  return (
    !!user &&
    hasAnyPermission({
      userPermissions: user.permissions,
      requiredPermissions: [customerSelfReadPermission],
    })
  );
};

const isDeliverySelfReadAllowed = (user: Express.Request['user']) => {
  return (
    !!user &&
    hasAnyPermission({
      userPermissions: user.permissions,
      requiredPermissions: [deliverySelfReadPermission],
    })
  );
};

const assertCustomerScopeAccess = ({
  user,
  customerId,
  requestContext,
}: {
  user: Express.Request['user'];
  customerId: string;
  requestContext?: TenantAuditContext;
}) => {
  const adminOverrideAllowed = canUseTenantAdminOverride({
    user,
    targetKind: 'customer',
  });

  if (!user || (!isCustomerSelfReadAllowed(user) && !adminOverrideAllowed)) {
    writeTenantAccessAudit({
      eventType: getTenantAuditEventType('access_denied'),
      user,
      metadata: buildTenantScopeAuditMetadata({
        kind: 'customer',
        field: 'customerId',
        requestedValue: customerId,
        userScope: {
          userId: user?.userId ?? null,
          vendorId: user?.vendorId ?? null,
          storeId: user?.storeId ?? null,
          cityId: user?.cityId ?? null,
        },
        reason: 'access_denied',
        overridePermission: isAdminScopeOverrideSupported('customer')
          ? adminUsersReadPermission
          : null,
      }),
      requestContext,
    });

    throw new AppError({
      message: 'Permission denied',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.FORBIDDEN,
    });
  }

  if (user.role === 'customer' && user.userId !== customerId) {
    writeTenantAccessAudit({
      eventType: getTenantAuditEventType('scope_mismatch'),
      user,
      metadata: buildTenantScopeAuditMetadata({
        kind: 'customer',
        field: 'customerId',
        requestedValue: customerId,
        userScope: {
          userId: user.userId,
          vendorId: user.vendorId,
          storeId: user.storeId,
          cityId: user.cityId,
        },
        reason: 'scope_mismatch',
      }),
      requestContext,
    });

    throw new AppError({
      message: 'Customer scope does not match',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.FORBIDDEN,
    });
  }

  if (adminOverrideAllowed && user.role !== 'customer') {
    writeTenantAccessAudit({
      eventType: getTenantAuditEventType('admin_override'),
      user,
      metadata: buildTenantScopeAuditMetadata({
        kind: 'customer',
        field: 'customerId',
        requestedValue: customerId,
        userScope: {
          userId: user.userId,
          vendorId: user.vendorId,
          storeId: user.storeId,
          cityId: user.cityId,
        },
        reason: 'admin_override',
        overridePermission: adminUsersReadPermission,
      }),
      requestContext,
      status: 'success',
    });
  }
};

const assertDeliveryAgentScopeAccess = ({
  user,
  deliveryAgentId,
  requestContext,
}: {
  user: Express.Request['user'];
  deliveryAgentId: string;
  requestContext?: TenantAuditContext;
}) => {
  const adminOverrideAllowed = canUseTenantAdminOverride({
    user,
    targetKind: 'delivery_agent',
  });

  if (!user || (!isDeliverySelfReadAllowed(user) && !adminOverrideAllowed)) {
    writeTenantAccessAudit({
      eventType: getTenantAuditEventType('access_denied'),
      user,
      metadata: buildTenantScopeAuditMetadata({
        kind: 'delivery_agent',
        field: 'deliveryAgentId',
        requestedValue: deliveryAgentId,
        userScope: {
          userId: user?.userId ?? null,
          vendorId: user?.vendorId ?? null,
          storeId: user?.storeId ?? null,
          cityId: user?.cityId ?? null,
        },
        reason: 'access_denied',
        overridePermission: isAdminScopeOverrideSupported('delivery_agent')
          ? adminUsersReadPermission
          : null,
      }),
      requestContext,
    });

    throw new AppError({
      message: 'Permission denied',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.FORBIDDEN,
    });
  }

  if (user.role === 'delivery_agent' && user.userId !== deliveryAgentId) {
    writeTenantAccessAudit({
      eventType: getTenantAuditEventType('scope_mismatch'),
      user,
      metadata: buildTenantScopeAuditMetadata({
        kind: 'delivery_agent',
        field: 'deliveryAgentId',
        requestedValue: deliveryAgentId,
        userScope: {
          userId: user.userId,
          vendorId: user.vendorId,
          storeId: user.storeId,
          cityId: user.cityId,
        },
        reason: 'scope_mismatch',
      }),
      requestContext,
    });

    throw new AppError({
      message: 'Delivery agent scope does not match',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: ERROR_CODES.FORBIDDEN,
    });
  }

  if (adminOverrideAllowed && user.role !== 'delivery_agent') {
    writeTenantAccessAudit({
      eventType: getTenantAuditEventType('admin_override'),
      user,
      metadata: buildTenantScopeAuditMetadata({
        kind: 'delivery_agent',
        field: 'deliveryAgentId',
        requestedValue: deliveryAgentId,
        userScope: {
          userId: user.userId,
          vendorId: user.vendorId,
          storeId: user.storeId,
          cityId: user.cityId,
        },
        reason: 'admin_override',
        overridePermission: adminUsersReadPermission,
      }),
      requestContext,
      status: 'success',
    });
  }
};

export const createInternalTenantAccessTestRecord = async (
  input: CreateTenantAccessTestInput,
) => {
  return createTenantAccessTestRecord(input);
};

export const listTenantAccessTestsByVendorStoreScope = async ({
  vendorId,
  storeId,
}: {
  vendorId: string;
  storeId: string;
}) => {
  return findTenantAccessTestsByVendorStore({
    vendorId,
    storeId,
  });
};

export const listTenantAccessTestsByCustomerScope = async ({
  user,
  customerId,
  requestContext,
}: {
  user: Express.Request['user'];
  customerId: string;
  requestContext?: TenantAuditContext;
}) => {
  assertCustomerScopeAccess({
    user,
    customerId,
    requestContext,
  });

  return findTenantAccessTestsByCustomer({
    customerId,
  });
};

export const listTenantAccessTestsByDeliveryAgentScope = async ({
  user,
  deliveryAgentId,
  requestContext,
}: {
  user: Express.Request['user'];
  deliveryAgentId: string;
  requestContext?: TenantAuditContext;
}) => {
  assertDeliveryAgentScopeAccess({
    user,
    deliveryAgentId,
    requestContext,
  });

  return findTenantAccessTestsByDeliveryAgent({
    deliveryAgentId,
  });
};
