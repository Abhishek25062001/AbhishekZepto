"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDeliveryDeviceToken = exports.registerDeliveryDeviceToken = void 0;
const client_1 = require("../../../services/api/client");
const registerDeliveryDeviceToken = async (payload) => {
    const response = await client_1.apiClient.post('/api/v1/delivery/me/device-token', payload);
    return response.data;
};
exports.registerDeliveryDeviceToken = registerDeliveryDeviceToken;
const removeDeliveryDeviceToken = async (deviceId) => {
    const response = await client_1.apiClient.delete(`/api/v1/delivery/me/device-token/${encodeURIComponent(deviceId)}`);
    return response.data;
};
exports.removeDeliveryDeviceToken = removeDeliveryDeviceToken;
