import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  IN_APP_NOTIFICATION_ERROR_CODES,
  type InAppNotificationErrorCode,
} from '../constants/in-app-notification-error-codes.constant';

const toErrorCode = (code: InAppNotificationErrorCode): ErrorCode => ERROR_CODES[code];

export const notificationNotFoundError = (): AppError =>
  new AppError({
    message: 'Notification not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(IN_APP_NOTIFICATION_ERROR_CODES.NOTIFICATION_NOT_FOUND),
  });

export const notificationScopeDeniedError = (): AppError =>
  new AppError({
    message: 'Notification does not belong to this user',
    statusCode: HTTP_STATUS.FORBIDDEN,
    errorCode: toErrorCode(IN_APP_NOTIFICATION_ERROR_CODES.NOTIFICATION_SCOPE_DENIED),
  });
