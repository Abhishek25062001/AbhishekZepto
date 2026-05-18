import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  listMySessions,
  logoutOtherSessions,
  logoutOwnedSession,
} from '../services/auth.service';

const requireUser = (user: Express.Request['user']) => {
  if (!user) {
    throw new AppError({
      message: 'Authentication token is required',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      errorCode: ERROR_CODES.UNAUTHORIZED,
    });
  }

  return user;
};

export const listMySessionsController = asyncHandler(async (req, res) => {
  const response = await listMySessions(requireUser(req.user));

  return sendSuccessResponse({
    res,
    message: 'Sessions fetched successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const logoutSessionController = asyncHandler(async (req, res) => {
  const response = await logoutOwnedSession(requireUser(req.user), req.body);

  return sendSuccessResponse({
    res,
    message: 'Session logged out successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const logoutOtherSessionsController = asyncHandler(async (req, res) => {
  const response = await logoutOtherSessions(requireUser(req.user), req.body);

  return sendSuccessResponse({
    res,
    message: 'Other sessions logged out successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
