"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_checkout_error_message_util_1 = require("./customer-checkout-error-message.util");
(0, node_test_1.test)('isCheckoutPriceChangedError detects CHECKOUT_PRICE_CHANGED', () => {
    const error = {
        response: { data: { error: { code: 'CHECKOUT_PRICE_CHANGED' } } },
    };
    strict_1.default.equal((0, customer_checkout_error_message_util_1.isCheckoutPriceChangedError)(error), true);
});
(0, node_test_1.test)('getCheckoutErrorMessage maps price changed to cart refresh hint', () => {
    const error = {
        response: { data: { error: { code: 'CHECKOUT_PRICE_CHANGED' } } },
    };
    strict_1.default.match((0, customer_checkout_error_message_util_1.getCheckoutErrorMessage)(error, 'fallback'), /cart/i);
});
(0, node_test_1.test)('isCheckoutSessionExpiredError detects CHECKOUT_SESSION_EXPIRED', () => {
    const error = {
        response: { data: { error: { code: 'CHECKOUT_SESSION_EXPIRED' } } },
    };
    strict_1.default.equal((0, customer_checkout_error_message_util_1.isCheckoutSessionExpiredError)(error), true);
});
(0, node_test_1.test)('isCheckoutStockUnavailableError detects CHECKOUT_STOCK_UNAVAILABLE', () => {
    const error = {
        response: { data: { error: { code: 'CHECKOUT_STOCK_UNAVAILABLE' } } },
    };
    strict_1.default.equal((0, customer_checkout_error_message_util_1.isCheckoutStockUnavailableError)(error), true);
});
(0, node_test_1.test)('getCheckoutErrorCode returns code when present', () => {
    const error = {
        response: { data: { error: { code: 'CHECKOUT_CART_EMPTY' } } },
    };
    strict_1.default.equal((0, customer_checkout_error_message_util_1.getCheckoutErrorCode)(error), 'CHECKOUT_CART_EMPTY');
});
