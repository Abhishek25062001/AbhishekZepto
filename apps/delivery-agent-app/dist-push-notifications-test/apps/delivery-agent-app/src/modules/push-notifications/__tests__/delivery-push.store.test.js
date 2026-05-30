"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_push_store_1 = require("../store/delivery-push.store");
node_test_1.test.afterEach(() => {
    delivery_push_store_1.useDeliveryPushStore.getState().clearPushState();
});
(0, node_test_1.test)('delivery push store updates permission state', () => {
    delivery_push_store_1.useDeliveryPushStore.getState().setPermissionStatus('granted');
    strict_1.default.equal(delivery_push_store_1.useDeliveryPushStore.getState().permissionStatus, 'granted');
});
(0, node_test_1.test)('delivery push store sets FCM token', () => {
    delivery_push_store_1.useDeliveryPushStore.getState().setFcmToken('delivery-fcm-token');
    strict_1.default.equal(delivery_push_store_1.useDeliveryPushStore.getState().fcmToken, 'delivery-fcm-token');
});
(0, node_test_1.test)('delivery push store clears on logout', () => {
    const store = delivery_push_store_1.useDeliveryPushStore.getState();
    store.setPermissionStatus('granted');
    store.setFcmToken('delivery-fcm-token');
    store.setDeviceId('device-1');
    store.setRegistered(true);
    store.clearPushState();
    strict_1.default.equal(delivery_push_store_1.useDeliveryPushStore.getState().permissionStatus, 'unavailable');
    strict_1.default.equal(delivery_push_store_1.useDeliveryPushStore.getState().fcmToken, null);
    strict_1.default.equal(delivery_push_store_1.useDeliveryPushStore.getState().deviceId, null);
    strict_1.default.equal(delivery_push_store_1.useDeliveryPushStore.getState().isRegistered, false);
});
