"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const payment_idempotency_util_1 = require("./payment-idempotency.util");
(0, node_test_1.test)('createPaymentIdempotencyKey returns non-empty unique keys', () => {
    const a = (0, payment_idempotency_util_1.createPaymentIdempotencyKey)();
    const b = (0, payment_idempotency_util_1.createPaymentIdempotencyKey)();
    strict_1.default.ok(a.length > 0);
    strict_1.default.ok(b.length > 0);
    strict_1.default.notEqual(a, b);
});
(0, node_test_1.test)('isValidPaymentIdempotencyKey enforces max length 128', () => {
    strict_1.default.equal((0, payment_idempotency_util_1.isValidPaymentIdempotencyKey)('short-key'), true);
    strict_1.default.equal((0, payment_idempotency_util_1.isValidPaymentIdempotencyKey)(''), false);
    strict_1.default.equal((0, payment_idempotency_util_1.isValidPaymentIdempotencyKey)('x'.repeat(129)), false);
});
