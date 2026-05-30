"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCustomerDeviceToken = exports.registerCustomerDeviceToken = void 0;
const client_1 = require("../../../services/api/client");
const registerCustomerDeviceToken = async (payload) => {
    const response = await client_1.apiClient.post('/api/v1/customer/me/device-token', payload);
    return response.data;
};
exports.registerCustomerDeviceToken = registerCustomerDeviceToken;
const removeCustomerDeviceToken = async (deviceId) => {
    const response = await client_1.apiClient.delete(`/api/v1/customer/me/device-token/${encodeURIComponent(deviceId)}`);
    return response.data;
};
exports.removeCustomerDeviceToken = removeCustomerDeviceToken;
