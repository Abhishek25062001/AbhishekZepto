import type { RequestHandler } from 'express';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  findActiveSessionById,
  findActiveUserIdentityById,
  findRoleByCode,
} from '../repositories';
import { AUTH_ACCOUNT_STATUS } from '../constants/auth-status.constants';
import { resolveEffectivePermissions } from '../services/permission.service';
import { resolveEffectiveAuthScope } from '../services/scope-access.service';
import { verifyAccessToken } from '../services/token.service';

const bearerTokenPrefix = 'Bearer ';

export const authenticate = (): RequestHandler => {
  return async (req, _res, next) => {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      return next(
        new AppError({
          message: 'Authentication token is required',
          statusCode: HTTP_STATUS.UNAUTHORIZED,
          errorCode: ERROR_CODES.UNAUTHORIZED,
        }),
      );
    }

    if (!authorizationHeader.startsWith(bearerTokenPrefix)) {
      return next(
        new AppError({
          message: 'Invalid authentication token format',
          statusCode: HTTP_STATUS.UNAUTHORIZED,
          errorCode: ERROR_CODES.UNAUTHORIZED,
        }),
      );
    }

    const token = authorizationHeader.slice(bearerTokenPrefix.length).trim();

    if (!token) {
      return next(
        new AppError({
          message: 'Authentication token is required',
          statusCode: HTTP_STATUS.UNAUTHORIZED,
          errorCode: ERROR_CODES.UNAUTHORIZED,
        }),
      );
    }

    try {
      const tokenPayload = verifyAccessToken(token);
      const session = await findActiveSessionById(tokenPayload.sessionId);

      if (!session || session.userId.toString() !== tokenPayload.userId) {
        return next(
          new AppError({
            message: 'Session revoked',
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            errorCode: ERROR_CODES.SESSION_REVOKED,
          }),
        );
      }

      if (session.expiresAt.getTime() <= Date.now()) {
        return next(
          new AppError({
            message: 'Session expired',
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            errorCode: ERROR_CODES.SESSION_EXPIRED,
          }),
        );
      }

      const user = await findActiveUserIdentityById(tokenPayload.userId);

      if (!user) {
        return next(
          new AppError({
            message: 'User not found',
            statusCode: HTTP_STATUS.UNAUTHORIZED,
            errorCode: ERROR_CODES.UNAUTHORIZED,
          }),
        );
      }

      if (user.accountStatus === AUTH_ACCOUNT_STATUS.BLOCKED) {
        return next(
          new AppError({
            message: 'Account is blocked',
            statusCode: HTTP_STATUS.FORBIDDEN,
            errorCode: ERROR_CODES.ACCOUNT_BLOCKED,
          }),
        );
      }

      if (user.accountStatus === AUTH_ACCOUNT_STATUS.INACTIVE) {
        return next(
          new AppError({
            message: 'Account is inactive',
            statusCode: HTTP_STATUS.FORBIDDEN,
            errorCode: ERROR_CODES.ACCOUNT_INACTIVE,
          }),
        );
      }

      if (user.accountStatus === AUTH_ACCOUNT_STATUS.PENDING_APPROVAL) {
        return next(
          new AppError({
            message: 'Account approval is pending',
            statusCode: HTTP_STATUS.FORBIDDEN,
            errorCode: ERROR_CODES.ACCOUNT_PENDING_APPROVAL,
          }),
        );
      }

      const roleRecord = await findRoleByCode(user.role);
      const effectivePermissions = resolveEffectivePermissions({
        rolePermissions: roleRecord?.permissions ?? [],
        userPermissions: [...(tokenPayload.permissions ?? []), ...user.permissions],
      });
      const effectiveScope = resolveEffectiveAuthScope({
        identityScope: {
          vendorId: user.vendorId?.toString(),
          storeId: user.storeId?.toString(),
          cityId: user.cityId?.toString(),
        },
        tokenScope: {
          vendorId: tokenPayload.vendorId,
          storeId: tokenPayload.storeId,
          cityId: tokenPayload.cityId,
        },
      });

      req.user = {
        userId: user._id.toString(),
        role: user.role,
        permissions: effectivePermissions,
        sessionId: session._id.toString(),
        ...effectiveScope,
      };
    } catch (error) {
      return next(error);
    }

    return next();
  };
};
