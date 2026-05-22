"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPaymentIdempotencyKey = exports.createPaymentIdempotencyKey = void 0;
const MAX_IDEMPOTENCY_KEY_LENGTH = 128;
const createPaymentIdempotencyKey = () => {
    const cryptoApi = globalThis.crypto;
    if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
        return cryptoApi.randomUUID();
    }
    return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
};
exports.createPaymentIdempotencyKey = createPaymentIdempotencyKey;
const isValidPaymentIdempotencyKey = (key) => key.length > 0 && key.length <= MAX_IDEMPOTENCY_KEY_LENGTH;
exports.isValidPaymentIdempotencyKey = isValidPaymentIdempotencyKey;
