"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_order_error_message_util_1 = require("./customer-order-error-message.util");
(0, node_test_1.test)('getOrderErrorMessage maps ORDER_NOT_FOUND', () => {
    const error = {
        response: {
            data: {
                error: { code: 'ORDER_NOT_FOUND', details: {} },
                message: 'Not found',
            },
        },
    };
    strict_1.default.equal((0, customer_order_error_message_util_1.getOrderErrorMessage)(error, 'fallback'), 'Order not found.');
    strict_1.default.equal((0, customer_order_error_message_util_1.isOrderNotFoundError)(error), true);
});
(0, node_test_1.test)('getOrderErrorMessage maps cancellation errors', () => {
    strict_1.default.equal((0, customer_order_error_message_util_1.getOrderErrorMessage)({
        response: {
            data: {
                error: { code: 'ORDER_CANCELLATION_NOT_ALLOWED' },
                message: 'server',
            },
        },
    }, 'fallback'), 'This order can no longer be cancelled.');
    strict_1.default.equal((0, customer_order_error_message_util_1.getOrderErrorMessage)({
        response: {
            data: {
                error: { code: 'ORDER_CANCELLATION_REASON_REQUIRED' },
                message: 'server',
            },
        },
    }, 'fallback'), 'Cancellation reason is required.');
});
(0, node_test_1.test)('getOrderErrorMessage maps ORDER_NOT_OWNED', () => {
    const error = {
        response: {
            data: {
                error: { code: 'ORDER_NOT_OWNED', details: {} },
                message: 'Forbidden',
            },
        },
    };
    strict_1.default.equal((0, customer_order_error_message_util_1.getOrderErrorMessage)(error, 'fallback'), 'You do not have access to this order.');
});
(0, node_test_1.test)('getOrderErrorMessage uses fallback for unknown errors', () => {
    strict_1.default.equal((0, customer_order_error_message_util_1.getOrderErrorMessage)(new Error('network'), 'Could not load.'), 'Could not load.');
});
