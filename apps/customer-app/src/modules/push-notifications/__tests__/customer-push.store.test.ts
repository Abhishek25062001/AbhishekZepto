import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useCustomerPushStore } from '../store/customer-push.store';

test.afterEach(() => {
  useCustomerPushStore.getState().clearPushState();
});

test('customer push store updates permission state', () => {
  useCustomerPushStore.getState().setPermissionStatus('granted');

  assert.equal(useCustomerPushStore.getState().permissionStatus, 'granted');
});

test('customer push store sets FCM token', () => {
  useCustomerPushStore.getState().setFcmToken('customer-fcm-token');

  assert.equal(useCustomerPushStore.getState().fcmToken, 'customer-fcm-token');
});

test('customer push store clears on logout', () => {
  const store = useCustomerPushStore.getState();
  store.setPermissionStatus('granted');
  store.setFcmToken('customer-fcm-token');
  store.setDeviceId('device-1');
  store.setRegistered(true);

  store.clearPushState();

  assert.equal(useCustomerPushStore.getState().permissionStatus, 'unavailable');
  assert.equal(useCustomerPushStore.getState().fcmToken, null);
  assert.equal(useCustomerPushStore.getState().deviceId, null);
  assert.equal(useCustomerPushStore.getState().isRegistered, false);
});
