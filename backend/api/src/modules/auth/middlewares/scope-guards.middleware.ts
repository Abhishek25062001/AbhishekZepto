import type { Request, RequestHandler } from 'express';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { writeAuditLog } from '../../audit';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUTH_SCOPE_KIND } from '../constants/auth-scope.constants';
import type { AuthScopeField, AuthScopeKind } from '../types/auth-scope.types';
import {
  buildTenantScopeAuditMetadata,
  getAuditActorSurfaceForRole,
  getTenantAuditEventType,
  toScopeAuditObjectIdOrNull,
} from '../services/scope-access.service';
import { getScopeValue, hasRequiredScope, matchesScopeValue } from '../utils/scope-access.util';

type ScopeValueResolver =
  | string
  | ((request: Request) => string | null | undefined);

const resolveExpectedScopeValue = ({
  request,
  resolver,
}: {
  request: Request;
  resolver?: ScopeValueResolver;
}): string | null => {
  if (!resolver) {
    return null;
  }

  if (typeof resolver === 'function') {
    return resolver(request) ?? null;
  }

  return resolver;
};

const toReadableScopeName = (kind: AuthScopeKind): string => {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
};

const getMissingScopeErrorCode = (kind: AuthScopeKind) => {
  if (kind === AUTH_SCOPE_KIND.VENDOR) {
    return ERROR_CODES.VENDOR_SCOPE_REQUIRED;
  }

  if (kind === AUTH_SCOPE_KIND.STORE) {
    return ERROR_CODES.STORE_SCOPE_REQUIRED;
  }

  return ERROR_CODES.CITY_SCOPE_REQUIRED;
};

const getScopeMismatchErrorCode = (kind: AuthScopeKind) => {
  if (kind === AUTH_SCOPE_KIND.VENDOR) {
    return ERROR_CODES.VENDOR_SCOPE_MISMATCH;
  }

  if (kind === AUTH_SCOPE_KIND.STORE) {
    return ERROR_CODES.STORE_SCOPE_MISMATCH;
  }

  return ERROR_CODES.CITY_SCOPE_MISMATCH;
};

export const createScopeGuard = ({
  kind,
  field,
  resolveExpectedValue,
}: {
  kind: AuthScopeKind;
  field: AuthScopeField;
  resolveExpectedValue?: ScopeValueResolver;
}): RequestHandler => {
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

    if (!hasRequiredScope({ kind, scope: req.user })) {
      void writeAuditLog({
        eventType: getTenantAuditEventType('missing_scope'),
        actorId: toScopeAuditObjectIdOrNull(req.user.userId),
        actorRole: req.user.role,
        actorSurface: getAuditActorSurfaceForRole(req.user.role),
        entityType: 'tenant_access',
        entityId: null,
        vendorId: toScopeAuditObjectIdOrNull(req.user.vendorId),
        storeId: toScopeAuditObjectIdOrNull(req.user.storeId),
        cityId: toScopeAuditObjectIdOrNull(req.user.cityId),
        requestId: req.requestId ?? null,
        traceId: req.traceId ?? null,
        ipAddress: req.ip ?? null,
        userAgent: req.get('user-agent') ?? null,
        metadata: buildTenantScopeAuditMetadata({
          kind,
          field,
          requestedValue: resolveExpectedScopeValue({
            request: req,
            resolver: resolveExpectedValue,
          }),
          userScope: {
            userId: req.user.userId,
            vendorId: req.user.vendorId,
            storeId: req.user.storeId,
            cityId: req.user.cityId,
          },
          reason: 'missing_scope',
        }),
        status: 'failed',
      });

      return next(
        new AppError({
          message: `${toReadableScopeName(kind)} scope is required`,
          statusCode: HTTP_STATUS.FORBIDDEN,
          errorCode: getMissingScopeErrorCode(kind),
        }),
      );
    }

    const expectedScopeValue = resolveExpectedScopeValue({
      request: req,
      resolver: resolveExpectedValue,
    });

    if (
      expectedScopeValue &&
      !matchesScopeValue({
        actualValue: getScopeValue({
          field,
          scope: req.user,
        }),
        expectedValue: expectedScopeValue,
      })
    ) {
      void writeAuditLog({
        eventType: getTenantAuditEventType('scope_mismatch'),
        actorId: toScopeAuditObjectIdOrNull(req.user.userId),
        actorRole: req.user.role,
        actorSurface: getAuditActorSurfaceForRole(req.user.role),
        entityType: 'tenant_access',
        entityId: null,
        vendorId: toScopeAuditObjectIdOrNull(req.user.vendorId),
        storeId: toScopeAuditObjectIdOrNull(req.user.storeId),
        cityId: toScopeAuditObjectIdOrNull(req.user.cityId),
        requestId: req.requestId ?? null,
        traceId: req.traceId ?? null,
        ipAddress: req.ip ?? null,
        userAgent: req.get('user-agent') ?? null,
        metadata: buildTenantScopeAuditMetadata({
          kind,
          field,
          requestedValue: expectedScopeValue,
          userScope: {
            userId: req.user.userId,
            vendorId: req.user.vendorId,
            storeId: req.user.storeId,
            cityId: req.user.cityId,
          },
          reason: 'scope_mismatch',
        }),
        status: 'failed',
      });

      return next(
        new AppError({
          message: `${toReadableScopeName(kind)} scope does not match`,
          statusCode: HTTP_STATUS.FORBIDDEN,
          errorCode: getScopeMismatchErrorCode(kind),
        }),
      );
    }

    return next();
  };
};
