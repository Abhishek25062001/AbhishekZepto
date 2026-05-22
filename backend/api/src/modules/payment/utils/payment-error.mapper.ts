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
