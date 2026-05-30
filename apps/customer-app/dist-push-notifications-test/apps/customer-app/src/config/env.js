"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAZORPAY_KEY_ID = exports.isDevelopment = exports.CUSTOMER_SOCKET_RECONNECT_DELAY_MS = exports.CUSTOMER_SOCKET_RECONNECT_ATTEMPTS = exports.CUSTOMER_SOCKET_BASE_URL = exports.API_BASE_URL = exports.APP_ENV = void 0;
const runtimeEnv = globalThis.process?.env ?? {};
exports.APP_ENV = runtimeEnv.APP_ENV ?? 'development';
exports.API_BASE_URL = runtimeEnv.API_BASE_URL ?? 'http://localhost:5000';
exports.CUSTOMER_SOCKET_BASE_URL = runtimeEnv.CUSTOMER_SOCKET_BASE_URL ?? `${exports.API_BASE_URL}/customer`;
const toPositiveInteger = (value, fallback) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};
exports.CUSTOMER_SOCKET_RECONNECT_ATTEMPTS = toPositiveInteger(runtimeEnv.CUSTOMER_SOCKET_RECONNECT_ATTEMPTS, 5);
exports.CUSTOMER_SOCKET_RECONNECT_DELAY_MS = toPositiveInteger(runtimeEnv.CUSTOMER_SOCKET_RECONNECT_DELAY_MS, 1000);
exports.isDevelopment = exports.APP_ENV === 'development';
exports.RAZORPAY_KEY_ID = runtimeEnv.RAZORPAY_KEY_ID ?? '';
