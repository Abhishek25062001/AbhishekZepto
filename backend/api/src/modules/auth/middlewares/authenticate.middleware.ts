import type { RequestHandler } from 'express';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { AUTH_ROLE } from '../constants/auth-role.constants';

const bearerTokenPrefix = 'Bearer ';

export const authenticate = (): RequestHandler => {
  return (req, _res, next) => {
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

    req.user = {
      userId: 'phase1-auth-user-placeholder',
      role: AUTH_ROLE.SUPER_ADMIN,
      permissions: ['auth:read', '*:*'],
      sessionId: 'phase1-auth-session-placeholder',
    };

    return next();
  };
};
