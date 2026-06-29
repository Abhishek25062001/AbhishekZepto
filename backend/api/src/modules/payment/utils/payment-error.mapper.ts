import { AppError } from '../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  PAYMENT_ERROR_CODES,
  type PaymentErrorCode,
} from '../constants/payment-error-codes.constant';

const toErrorCode = (code: PaymentErrorCode): ErrorCode => ERROR_CODES[code];

export const paymentNotFoundError = (): AppError =>
  new AppError({
    message: 'Payment not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_NOT_FOUND),
  });

export const paymentAlreadyPaidError = (): AppError =>
  new AppError({
    message: 'Payment has already been completed',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_ALREADY_PAID),
  });

export const paymentVerificationFailedError = (): AppError =>
  new AppError({
    message: 'Payment verification failed',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_VERIFICATION_FAILED),
  });

export const paymentAmountMismatchError = (): AppError =>
  new AppError({
    message: 'Payment amount does not match checkout total',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_AMOUNT_MISMATCH),
  });

export const paymentGatewayError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Payment gateway request failed',
    statusCode: HTTP_STATUS.BAD_GATEWAY,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_GATEWAY_ERROR),
    details: details ?? {},
  });

export const paymentRecordNotFoundError = (): AppError =>
  new AppError({
    message: 'Payment record not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_RECORD_NOT_FOUND),
  });

export const paymentCustomerScopeInvalidError = (): AppError =>
  new AppError({
    message: 'Payment does not belong to this customer',
    statusCode: HTTP_STATUS.FORBIDDEN,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_CUSTOMER_SCOPE_INVALID),
  });

export const paymentAdminScopeInvalidError = (): AppError =>
  new AppError({
    message: 'Payment is outside admin scope',
    statusCode: HTTP_STATUS.FORBIDDEN,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_ADMIN_SCOPE_INVALID),
  });

export const paymentWebhookSignatureInvalidError = (): AppError =>
  new AppError({
    message: 'Payment webhook signature is invalid',
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    errorCode: toErrorCode(PAYMENT_ERROR_CODES.PAYMENT_WEBHOOK_SIGNATURE_INVALID),
  });
