"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_payment_error_message_util_1 = require("./customer-payment-error-message.util");
(0, node_test_1.test)('isPaymentVerificationFailedError detects PAYMENT_VERIFICATION_FAILED', () => {
    const error = {
        response: { data: { error: { code: 'PAYMENT_VERIFICATION_FAILED' } } },
    };
    strict_1.default.equal((0, customer_payment_error_message_util_1.isPaymentVerificationFailedError)(error), true);
});
(0, node_test_1.test)('isPaymentGatewayError detects PAYMENT_GATEWAY_ERROR', () => {
    const error = {
        response: { data: { error: { code: 'PAYMENT_GATEWAY_ERROR' } } },
    };
    strict_1.default.equal((0, customer_payment_error_message_util_1.isPaymentGatewayError)(error), true);
});
(0, node_test_1.test)('isCheckoutSessionExpiredOnPaymentError detects CHECKOUT_SESSION_EXPIRED', () => {
    const error = {
        response: { data: { error: { code: 'CHECKOUT_SESSION_EXPIRED' } } },
    };
    strict_1.default.equal((0, customer_payment_error_message_util_1.isCheckoutSessionExpiredOnPaymentError)(error), true);
});
(0, node_test_1.test)('getPaymentErrorMessage maps verification failed', () => {
    const error = {
        response: { data: { error: { code: 'PAYMENT_VERIFICATION_FAILED' } } },
    };
    strict_1.default.match((0, customer_payment_error_message_util_1.getPaymentErrorMessage)(error, 'fallback'), /verification/i);
});
(0, node_test_1.test)('isPaymentCancelledError detects PaymentCancelledError', () => {
    strict_1.default.equal((0, customer_payment_error_message_util_1.isPaymentCancelledError)(new customer_payment_error_message_util_1.PaymentCancelledError()), true);
});
(0, node_test_1.test)('getPaymentErrorCode returns code when present', () => {
    const error = {
        response: { data: { error: { code: 'PAYMENT_NOT_FOUND' } } },
    };
    strict_1.default.equal((0, customer_payment_error_message_util_1.getPaymentErrorCode)(error), 'PAYMENT_NOT_FOUND');
});
