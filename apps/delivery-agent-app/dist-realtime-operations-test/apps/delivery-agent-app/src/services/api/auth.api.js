"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryPermissions = exports.logoutOtherSessions = exports.logoutSession = exports.getMySessions = exports.logout = exports.refreshToken = exports.verifyOtp = exports.requestOtp = void 0;
const client_1 = require("./client");
const requestOtp = async (body) => {
    const response = await client_1.apiClient.post('/api/v1/public/auth/request-otp', body);
    return response.data;
};
exports.requestOtp = requestOtp;
const verifyOtp = async (body) => {
    const response = await client_1.apiClient.post('/api/v1/public/auth/verify-otp', body);
    return response.data;
};
exports.verifyOtp = verifyOtp;
const refreshToken = async (body) => {
    const response = await client_1.apiClient.post('/api/v1/public/auth/refresh-token', body);
    return response.data;
};
exports.refreshToken = refreshToken;
const logout = async (body) => {
    const response = await client_1.apiClient.post('/api/v1/public/auth/logout', body);
    return response.data;
};
exports.logout = logout;
const getMySessions = async () => {
    const response = await client_1.apiClient.get('/api/v1/auth/me/sessions');
    return response.data;
};
exports.getMySessions = getMySessions;
const logoutSession = async (body) => {
    const response = await client_1.apiClient.post('/api/v1/auth/logout-session', body);
    return response.data;
};
exports.logoutSession = logoutSession;
const logoutOtherSessions = async (body = {}) => {
    const response = await client_1.apiClient.post('/api/v1/auth/logout-other-sessions', body);
    return response.data;
};
exports.logoutOtherSessions = logoutOtherSessions;
const getDeliveryPermissions = async () => {
    const response = await client_1.apiClient.get('/api/v1/delivery/me/permissions');
    return response.data;
};
exports.getDeliveryPermissions = getDeliveryPermissions;
