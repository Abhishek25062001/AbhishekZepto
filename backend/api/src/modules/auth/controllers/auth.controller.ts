import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  logout,
  refreshAccessToken,
  requestOtp,
  verifyOtp,
} from '../services/auth.service';

const getRequestContext = (req: {
  get: (headerName: string) => string | undefined;
  ip?: string;
  requestId?: string;
  traceId?: string;
}) => ({
  requestId: req.requestId,
  traceId: req.traceId,
  ipAddress: req.ip ?? null,
  userAgent: req.get('user-agent') ?? null,
});

export const requestOtpController = asyncHandler(async (req, res) => {
  const response = await requestOtp(req.body, getRequestContext(req));

  return sendSuccessResponse({
    res,
    message: 'OTP sent successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const verifyOtpController = asyncHandler(async (req, res) => {
  const response = await verifyOtp(req.body, getRequestContext(req));

  return sendSuccessResponse({
    res,
    message: 'OTP verified successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const response = await refreshAccessToken(req.body, getRequestContext(req));

  return sendSuccessResponse({
    res,
    message: 'Access token refreshed successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const response = await logout(req.body, getRequestContext(req));

  return sendSuccessResponse({
    res,
    message: 'Logged out successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
