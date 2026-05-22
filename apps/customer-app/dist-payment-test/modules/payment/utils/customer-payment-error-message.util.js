"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPaymentCancelledError = exports.isCheckoutSessionExpiredOnPaymentError = exports.isPaymentNotFoundError = exports.isPaymentGatewayError = exports.isPaymentVerificationFailedError = exports.getPaymentErrorCode = exports.getPaymentErrorMessage = exports.PaymentCancelledError = exports.PAYMENT_CANCELLED_MESSAGE = void 0;
const ERROR_MESSAGES = {
    PAYMENT_NOT_FOUND: 'Payment not found.',
    PAYMENT_ALREADY_PAID: 'This payment was already completed.',
    PAYMENT_VERIFICATION_FAILED: 'Payment verification failed. Please try again.',
    PAYMENT_AMOUNT_MISMATCH: 'Payment amount does not match your order.',
    PAYMENT_GATEWAY_ERROR: 'Payment service is temporarily unavailable. Please try again.',
    CHECKOUT_SESSION_EXPIRED: 'Your reservation has expired. Please start checkout again.',
    CHECKOUT_SESSION_NOT_FOUND: 'Checkout session not found.',
};
exports.PAYMENT_CANCELLED_MESSAGE = 'Payment was cancelled.';
class PaymentCancelledError extends Error {
    constructor() {
        super(exports.PAYMENT_CANCELLED_MESSAGE);
        this.name = 'PaymentCancelledError';
    }
}
exports.PaymentCancelledError = PaymentCancelledError;
const getPaymentErrorMessage = (error, fallback) => {
    if (error instanceof PaymentCancelledError) {
        return error.message;
    }
    const axiosError = error;
    const code = axiosError.response?.data?.error?.code;
    if (code && ERROR_MESSAGES[code]) {
        return ERROR_MESSAGES[code];
    }
    return axiosError.response?.data?.message ?? fallback;
};
exports.getPaymentErrorMessage = getPaymentErrorMessage;
const getPaymentErrorCode = (error) => {
    const axiosError = error;
    return axiosError.response?.data?.error?.code;
};
exports.getPaymentErrorCode = getPaymentErrorCode;
const isPaymentVerificationFailedError = (error) => (0, exports.getPaymentErrorCode)(error) === 'PAYMENT_VERIFICATION_FAILED';
exports.isPaymentVerificationFailedError = isPaymentVerificationFailedError;
const isPaymentGatewayError = (error) => (0, exports.getPaymentErrorCode)(error) === 'PAYMENT_GATEWAY_ERROR';
exports.isPaymentGatewayError = isPaymentGatewayError;
const isPaymentNotFoundError = (error) => (0, exports.getPaymentErrorCode)(error) === 'PAYMENT_NOT_FOUND';
exports.isPaymentNotFoundError = isPaymentNotFoundError;
const isCheckoutSessionExpiredOnPaymentError = (error) => (0, exports.getPaymentErrorCode)(error) === 'CHECKOUT_SESSION_EXPIRED';
exports.isCheckoutSessionExpiredOnPaymentError = isCheckoutSessionExpiredOnPaymentError;
const isPaymentCancelledError = (error) => error instanceof PaymentCancelledError;
exports.isPaymentCancelledError = isPaymentCancelledError;
