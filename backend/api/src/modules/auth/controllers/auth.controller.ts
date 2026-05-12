import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../services/token.service';

const placeholderTokenInput = {
  userId: 'phase1-auth-user-placeholder',
  role: 'super_admin' as const,
  sessionId: 'phase1-auth-session-placeholder',
  permissions: ['*:*'],
};

export const requestOtpController = asyncHandler(async (_req, res) => {
  // TODO: Replace with real OTP request implementation in Phase 2.
  return sendSuccessResponse({
    res,
    message: 'OTP request placeholder ready',
    data: {
      otpEnabled: false,
    },
  });
});

export const verifyOtpController = asyncHandler(async (_req, res) => {
  // TODO: Replace with real OTP verification implementation in Phase 2.
  return sendSuccessResponse({
    res,
    message: 'OTP verification placeholder ready',
    data: {
      accessToken: generateAccessToken(placeholderTokenInput),
      refreshToken: generateRefreshToken(placeholderTokenInput),
    },
  });
});

export const refreshTokenController = asyncHandler(async (_req, res) => {
  // TODO: Replace with real refresh token implementation in Phase 2.
  return sendSuccessResponse({
    res,
    message: 'Refresh token placeholder ready',
    data: {
      accessToken: generateAccessToken(placeholderTokenInput),
    },
  });
});

export const logoutController = asyncHandler(async (_req, res) => {
  // TODO: Replace with real logout and session revocation implementation in Phase 2.
  return sendSuccessResponse({
    res,
    message: 'Logout placeholder ready',
    data: {},
  });
});
