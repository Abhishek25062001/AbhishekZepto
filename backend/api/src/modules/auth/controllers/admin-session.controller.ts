import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import type { AuthUserContext } from '../types/auth-user-context.types';
import {
  listAdminUserSessions,
  revokeAdminUserSession,
  revokeAllAdminUserSessions,
} from '../services/session.service';
import { requireStringParam } from './role.controller';

const requireAdminUser = (user: Express.Request['user']): AuthUserContext => {
  if (!user) {
    throw new AppError({
      message: 'Authentication token is required',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });
  }

  return user;
};

export const listAdminUserSessionsController = asyncHandler(async (req, res) => {
  const response = await listAdminUserSessions(requireStringParam(req.params.userId));

  return sendSuccessResponse({
    res,
    message: 'User sessions fetched successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const revokeAdminUserSessionController = asyncHandler(async (req, res) => {
  const response = await revokeAdminUserSession({
    admin: requireAdminUser(req.user),
    userId: requireStringParam(req.params.userId),
    sessionId: requireStringParam(req.params.sessionId),
  });

  return sendSuccessResponse({
    res,
    message: response.alreadyRevoked
      ? 'User session was already revoked'
      : 'User session revoked successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const revokeAllAdminUserSessionsController = asyncHandler(async (req, res) => {
  const response = await revokeAllAdminUserSessions({
    admin: requireAdminUser(req.user),
    userId: requireStringParam(req.params.userId),
  });

  return sendSuccessResponse({
    res,
    message: 'All user sessions revoked successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
