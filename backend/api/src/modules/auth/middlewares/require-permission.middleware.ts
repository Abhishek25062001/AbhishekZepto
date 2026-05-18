import type { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { AUDIT_EVENTS, writeAuditLog } from '../../audit';
import type { AuditActorSurface } from '../../audit';
import { HTTP_STATUS } from '../../../utils/http-status';
import { hasPermission } from '../services/permission.service';
import type { PermissionCode } from '../types/auth-permission.types';
import type { AuthRole } from '../types/auth-role.types';

const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

const getActorSurface = (role: AuthRole): AuditActorSurface => {
  if (role === 'customer') {
    return 'customer_app';
  }

  if (role === 'delivery_agent') {
    return 'delivery_agent_app';
  }

  if (role === 'vendor_owner' || role === 'store_manager' || role === 'store_staff') {
    return 'vendor_panel';
  }

  return 'admin_dashboard';
};

export const requirePermission = (
  requiredPermission: PermissionCode,
): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError({
          message: 'Authentication is required',
          statusCode: HTTP_STATUS.UNAUTHORIZED,
          errorCode: ERROR_CODES.UNAUTHORIZED,
        }),
      );
    }

    if (!hasPermission({ userPermissions: req.user.permissions, requiredPermission })) {
      void writeAuditLog({
        eventType: AUDIT_EVENTS.SECURITY_ACCESS_DENIED,
        actorId: toObjectIdOrNull(req.user.userId),
        actorRole: req.user.role,
        actorSurface: getActorSurface(req.user.role),
        entityType: null,
        entityId: null,
        vendorId: toObjectIdOrNull(req.user.vendorId),
        storeId: toObjectIdOrNull(req.user.storeId),
        cityId: toObjectIdOrNull(req.user.cityId),
        requestId: req.requestId ?? null,
        traceId: req.traceId ?? null,
        ipAddress: req.ip ?? null,
        userAgent: req.get('user-agent') ?? null,
        metadata: {
          requiredPermission,
        },
        status: 'failed',
      });

      return next(
        new AppError({
          message: 'Permission denied',
          statusCode: HTTP_STATUS.FORBIDDEN,
          errorCode: ERROR_CODES.FORBIDDEN,
        }),
      );
    }

    return next();
  };
};
