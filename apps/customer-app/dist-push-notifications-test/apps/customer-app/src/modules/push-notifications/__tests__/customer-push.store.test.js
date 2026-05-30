"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_push_store_1 = require("../store/customer-push.store");
node_test_1.test.afterEach(() => {
    customer_push_store_1.useCustomerPushStore.getState().clearPushState();
});
(0, node_test_1.test)('customer push store updates permission state', () => {
    customer_push_store_1.useCustomerPushStore.getState().setPermissionStatus('granted');
    strict_1.default.equal(customer_push_store_1.useCustomerPushStore.getState().permissionStatus, 'granted');
});
(0, node_test_1.test)('customer push store sets FCM token', () => {
    customer_push_store_1.useCustomerPushStore.getState().setFcmToken('customer-fcm-token');
    strict_1.default.equal(customer_push_store_1.useCustomerPushStore.getState().fcmToken, 'customer-fcm-token');
});
(0, node_test_1.test)('customer push store clears on logout', () => {
    const store = customer_push_store_1.useCustomerPushStore.getState();
    store.setPermissionStatus('granted');
    store.setFcmToken('customer-fcm-token');
    store.setDeviceId('device-1');
    store.setRegistered(true);
    store.clearPushState();
    strict_1.default.equal(customer_push_store_1.useCustomerPushStore.getState().permissionStatus, 'unavailable');
    strict_1.default.equal(customer_push_store_1.useCustomerPushStore.getState().fcmToken, null);
    strict_1.default.equal(customer_push_store_1.useCustomerPushStore.getState().deviceId, null);
    strict_1.default.equal(customer_push_store_1.useCustomerPushStore.getState().isRegistered, false);
});
