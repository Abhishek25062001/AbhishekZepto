"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const client_1 = require("../../services/api/client");
const delivery_device_token_api_1 = require("../../modules/push-notifications/services/delivery-device-token.api");
const client = client_1.apiClient;
const originalDelete = client_1.apiClient.delete;
const originalPost = client_1.apiClient.post;
(0, node_test_1.afterEach)(() => {
    client.delete = originalDelete;
    client.post = originalPost;
});
(0, node_test_1.test)('delivery push registration posts device token after login', async () => {
    let capturedUrl = null;
    let capturedBody = null;
    client.post = async (url, body) => {
        capturedUrl = url;
        capturedBody = body;
        return { data: { data: { deviceId: 'device-1' }, message: 'ok', success: true } };
    };
    await (0, delivery_device_token_api_1.registerDeliveryDeviceToken)({
        deviceId: 'device-1',
        fcmToken: 'fcm-token',
        platform: 'android',
    });
    strict_1.default.equal(capturedUrl, '/api/v1/delivery/me/device-token');
    strict_1.default.deepEqual(capturedBody, {
        deviceId: 'device-1',
        fcmToken: 'fcm-token',
        platform: 'android',
    });
});
(0, node_test_1.test)('delivery push registration revokes token on logout', async () => {
    let capturedUrl = null;
    client.delete = async (url) => {
        capturedUrl = url;
        return { data: { data: null, message: 'ok', success: true } };
    };
    await (0, delivery_device_token_api_1.removeDeliveryDeviceToken)('device-1');
    strict_1.default.equal(capturedUrl, '/api/v1/delivery/me/device-token/device-1');
});
