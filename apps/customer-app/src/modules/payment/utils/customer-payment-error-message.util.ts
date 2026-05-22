import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../../../types/api.types';

const ERROR_MESSAGES: Record<string, string> = {
  PAYMENT_NOT_FOUND: 'Payment not found.',
  PAYMENT_ALREADY_PAID: 'This payment was already completed.',
  PAYMENT_VERIFICATION_FAILED: 'Payment verification failed. Please try again.',
  PAYMENT_AMOUNT_MISMATCH: 'Payment amount does not match your order.',
  PAYMENT_GATEWAY_ERROR: 'Payment service is temporarily unavailable. Please try again.',
  CHECKOUT_SESSION_EXPIRED: 'Your reservation has expired. Please start checkout again.',
  CHECKOUT_SESSION_NOT_FOUND: 'Checkout session not found.',
};

export const PAYMENT_CANCELLED_MESSAGE = 'Payment was cancelled.';

export class PaymentCancelledError extends Error {
  constructor() {
    super(PAYMENT_CANCELLED_MESSAGE);
    this.name = 'PaymentCancelledError';
  }
}

export const getPaymentErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof PaymentCancelledError) {
    return error.message;
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;
  const code = axiosError.response?.data?.error?.code;

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return axiosError.response?.data?.message ?? fallback;
};

export const getPaymentErrorCode = (error: unknown): string | undefined => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.error?.code;
};

export const isPaymentVerificationFailedError = (error: unknown): boolean =>
  getPaymentErrorCode(error) === 'PAYMENT_VERIFICATION_FAILED';

export const isPaymentGatewayError = (error: unknown): boolean =>
  getPaymentErrorCode(error) === 'PAYMENT_GATEWAY_ERROR';

export const isPaymentNotFoundError = (error: unknown): boolean =>
  getPaymentErrorCode(error) === 'PAYMENT_NOT_FOUND';

export const isCheckoutSessionExpiredOnPaymentError = (error: unknown): boolean =>
  getPaymentErrorCode(error) === 'CHECKOUT_SESSION_EXPIRED';

export const isPaymentCancelledError = (error: unknown): boolean =>
  error instanceof PaymentCancelledError;
