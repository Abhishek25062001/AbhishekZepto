import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { listMySessions, logoutOwnedSession } from '../services/auth.service';

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

export const authTestController = asyncHandler(async (req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Protected auth test route working',
    data: {
      user: req.user || {},
    },
  });
});

export const authSessionListTestController = asyncHandler(async (req, res) => {
  const data = await listMySessions(requireUser(req.user));

  return sendSuccessResponse({
    res,
    message: 'Internal session list test route working',
    data,
  });
});

export const authSessionRevokeTestController = asyncHandler(async (req, res) => {
  const data = await logoutOwnedSession(requireUser(req.user), req.body);

  return sendSuccessResponse({
    res,
    message: 'Internal session revoke test route working',
    data,
  });
});
