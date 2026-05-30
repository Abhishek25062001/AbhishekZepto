import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useDeliveryPushStore } from '../store/delivery-push.store';

test.afterEach(() => {
  useDeliveryPushStore.getState().clearPushState();
});

test('delivery push store updates permission state', () => {
  useDeliveryPushStore.getState().setPermissionStatus('granted');

  assert.equal(useDeliveryPushStore.getState().permissionStatus, 'granted');
});

test('delivery push store sets FCM token', () => {
  useDeliveryPushStore.getState().setFcmToken('delivery-fcm-token');

  assert.equal(useDeliveryPushStore.getState().fcmToken, 'delivery-fcm-token');
});

test('delivery push store clears on logout', () => {
  const store = useDeliveryPushStore.getState();
  store.setPermissionStatus('granted');
  store.setFcmToken('delivery-fcm-token');
  store.setDeviceId('device-1');
  store.setRegistered(true);

  store.clearPushState();

  assert.equal(useDeliveryPushStore.getState().permissionStatus, 'unavailable');
  assert.equal(useDeliveryPushStore.getState().fcmToken, null);
  assert.equal(useDeliveryPushStore.getState().deviceId, null);
  assert.equal(useDeliveryPushStore.getState().isRegistered, false);
});
