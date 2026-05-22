"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const auth_store_1 = require("../../store/auth.store");
exports.apiClient = axios_1.default.create({
    baseURL: env_1.API_BASE_URL,
    timeout: 15000,
});
exports.apiClient.interceptors.request.use((config) => {
    const accessToken = auth_store_1.useAuthStore.getState().accessToken;
    config.headers['x-trace-id'] = config.headers?.['x-trace-id'] ?? 'admin-web-request';
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (env_1.isDevelopment) {
        console.debug('Admin Dashboard API request', {
            method: config.method,
            url: config.url,
            traceId: config.headers?.['x-trace-id'],
            authorization: config.headers?.Authorization ? '[redacted]' : undefined,
            accessToken: config.headers?.accessToken ? '[redacted]' : undefined,
            refreshToken: config.headers?.refreshToken ? '[redacted]' : undefined,
        });
    }
    return config;
});
exports.apiClient.interceptors.response.use((response) => {
    if (env_1.isDevelopment) {
        console.debug('Admin Dashboard API response', {
            status: response.status,
            url: response.config.url,
            responseTime: 'not_measured',
        });
    }
    return response;
}, (error) => {
    // Automatic refresh on 401 is intentionally deferred to the session module.
    if (env_1.isDevelopment) {
        console.debug('Admin Dashboard API response error', {
            status: error.response?.status,
            url: error.config?.url,
            responseTime: 'not_measured',
        });
    }
    return Promise.reject(error);
});
