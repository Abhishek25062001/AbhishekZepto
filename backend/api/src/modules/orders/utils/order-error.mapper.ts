import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  ORDER_ERROR_CODES,
  type OrderErrorCode,
} from '../constants/order-error-codes.constant';
import { paymentNotFoundError, paymentVerificationFailedError } from '../../payment/utils/payment-error.mapper';

const toErrorCode = (code: OrderErrorCode): ErrorCode => ERROR_CODES[code];

export const orderNotFoundError = (): AppError =>
  new AppError({
    message: 'Order not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_NOT_FOUND),
  });

export const orderCreationFailedError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Order creation failed',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_CREATION_FAILED),
    details: details ?? {},
  });

export const orderScopeRequiredError = (): AppError =>
  new AppError({
    message: 'Order store scope is required',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_SCOPE_REQUIRED),
  });

export const orderAccessForbiddenError = (): AppError =>
  new AppError({
    message: 'Order access forbidden',
    statusCode: HTTP_STATUS.FORBIDDEN,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_ACCESS_FORBIDDEN),
  });

export const orderAcceptanceNotAllowedError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Order cannot be accepted or rejected in its current state',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_ACCEPTANCE_NOT_ALLOWED),
    details: details ?? {},
  });

export const orderRejectionReasonRequiredError = (): AppError =>
  new AppError({
    message: 'Order rejection reason is required',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_REJECTION_REASON_REQUIRED),
  });

export const orderPickingNotAllowedError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Order picking operation is not allowed in its current state',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_PICKING_NOT_ALLOWED),
    details: details ?? {},
  });

export const orderPackingNotAllowedError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Order packing operation is not allowed in its current state',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_PACKING_NOT_ALLOWED),
    details: details ?? {},
  });

export const orderStatusUpdateNotAllowedError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Order status update is not allowed in its current state',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_STATUS_UPDATE_NOT_ALLOWED),
    details: details ?? {},
  });

export const orderCancellationNotAllowedError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Order cancellation is not allowed in its current state',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_CANCELLATION_NOT_ALLOWED),
    details: details ?? {},
  });

export const orderCancellationReasonRequiredError = (): AppError =>
  new AppError({
    message: 'Order cancellation reason is required',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_CANCELLATION_REASON_REQUIRED),
  });

export const orderItemOperationInvalidError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Order item picking operation is invalid',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(ORDER_ERROR_CODES.ORDER_ITEM_OPERATION_INVALID),
    details: details ?? {},
  });

export const paymentNotReadyForOrderError = (): AppError => paymentVerificationFailedError();

export { paymentNotFoundError };
