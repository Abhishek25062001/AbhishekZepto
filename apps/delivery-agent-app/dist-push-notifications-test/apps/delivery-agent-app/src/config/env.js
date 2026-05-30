"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.DELIVERY_SOCKET_RECONNECT_DELAY_MS = exports.DELIVERY_SOCKET_RECONNECT_ATTEMPTS = exports.DELIVERY_SOCKET_BASE_URL = exports.API_BASE_URL = exports.APP_ENV = void 0;
const runtimeEnv = globalThis.process?.env ?? {};
exports.APP_ENV = runtimeEnv.APP_ENV ?? 'development';
exports.API_BASE_URL = runtimeEnv.API_BASE_URL ?? 'http://localhost:5000';
const parsePositiveIntegerEnv = (value, fallback) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};
exports.DELIVERY_SOCKET_BASE_URL = runtimeEnv.DELIVERY_SOCKET_BASE_URL ?? 'http://localhost:5000/delivery';
exports.DELIVERY_SOCKET_RECONNECT_ATTEMPTS = parsePositiveIntegerEnv(runtimeEnv.DELIVERY_SOCKET_RECONNECT_ATTEMPTS, 5);
exports.DELIVERY_SOCKET_RECONNECT_DELAY_MS = parsePositiveIntegerEnv(runtimeEnv.DELIVERY_SOCKET_RECONNECT_DELAY_MS, 1000);
exports.isDevelopment = exports.APP_ENV === 'development';
