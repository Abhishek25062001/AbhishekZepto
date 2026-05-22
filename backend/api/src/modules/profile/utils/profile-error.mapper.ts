import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  PROFILE_ERROR_CODES,
  type ProfileErrorCode,
} from '../constants/profile-error-codes.constant';

const toErrorCode = (code: ProfileErrorCode): ErrorCode => ERROR_CODES[code];

export const profileValidationFailedError = (
  details?: Record<string, unknown>,
): AppError =>
  new AppError({
    message: 'Profile validation failed',
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errorCode: toErrorCode(PROFILE_ERROR_CODES.PROFILE_VALIDATION_FAILED),
    details: details ?? {},
  });

export const profileUserNotFoundError = (): AppError =>
  new AppError({
    message: 'User not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: ERROR_CODES.USER_NOT_FOUND,
  });
