"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_cart_error_message_util_1 = require("./customer-cart-error-message.util");
(0, node_test_1.test)('isCartNotFoundError detects CART_NOT_FOUND', () => {
    const error = {
        response: { data: { error: { code: 'CART_NOT_FOUND' } } },
    };
    strict_1.default.equal((0, customer_cart_error_message_util_1.isCartNotFoundError)(error), true);
});
(0, node_test_1.test)('getCustomerCartErrorMessage maps insufficient stock', () => {
    const error = {
        response: { data: { error: { code: 'CART_INSUFFICIENT_STOCK' } } },
    };
    strict_1.default.match((0, customer_cart_error_message_util_1.getCustomerCartErrorMessage)(error, 'fallback'), /stock/i);
});
(0, node_test_1.test)('isCartPriceChangedError detects CART_PRICE_CHANGED', () => {
    const error = {
        response: { data: { error: { code: 'CART_PRICE_CHANGED' } } },
    };
    strict_1.default.equal((0, customer_cart_error_message_util_1.isCartPriceChangedError)(error), true);
});
(0, node_test_1.test)('getCustomerCartErrorMessage maps price changed to refresh hint', () => {
    const error = {
        response: { data: { error: { code: 'CART_PRICE_CHANGED' } } },
    };
    strict_1.default.match((0, customer_cart_error_message_util_1.getCustomerCartErrorMessage)(error, 'fallback'), /refresh/i);
});
(0, node_test_1.test)('getCustomerCartErrorCode returns code when present', () => {
    const error = {
        response: { data: { error: { code: 'CART_MAX_QUANTITY_EXCEEDED' } } },
    };
    strict_1.default.equal((0, customer_cart_error_message_util_1.getCustomerCartErrorCode)(error), 'CART_MAX_QUANTITY_EXCEEDED');
});
