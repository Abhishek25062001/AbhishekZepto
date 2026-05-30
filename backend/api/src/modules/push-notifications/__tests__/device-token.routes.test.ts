import assert from 'node:assert/strict';
import { test } from 'node:test';

import customerDeviceTokenRoutes from '../routes/customer-device-token.routes';
import deliveryDeviceTokenRoutes from '../routes/delivery-device-token.routes';
import {
  registerCustomerDeviceTokenBodyValidator,
  registerDeliveryDeviceTokenBodyValidator,
  removeCustomerDeviceTokenParamsValidator,
  removeDeliveryDeviceTokenParamsValidator,
} from '../validators/device-token.validator';

const listRoutes = (
  router: typeof customerDeviceTokenRoutes,
): Array<{ path: string; methods: string[] }> => {
  const stack = (router as unknown as { stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }> })
    .stack;

  return stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      methods: Object.keys(layer.route!.methods),
      path: layer.route!.path,
    }));
};

test('customer device token routes expose register and remove endpoints', () => {
  assert.deepEqual(listRoutes(customerDeviceTokenRoutes), [
    { methods: ['post'], path: '/' },
    { methods: ['delete'], path: '/:deviceId' },
  ]);
});

test('delivery device token routes expose register and remove endpoints', () => {
  assert.deepEqual(listRoutes(deliveryDeviceTokenRoutes), [
    { methods: ['post'], path: '/' },
    { methods: ['delete'], path: '/:deviceId' },
  ]);
});

test('device token validators require device id FCM token and platform', () => {
  assert.throws(() => registerCustomerDeviceTokenBodyValidator.parse({}));
  assert.throws(() =>
    registerDeliveryDeviceTokenBodyValidator.parse({
      deviceId: 'device-1',
      fcmToken: 'fcm-token',
      platform: 'desktop',
    }),
  );
  assert.deepEqual(
    registerCustomerDeviceTokenBodyValidator.parse({
      appVersion: '7.0.0',
      deviceId: 'device-1',
      fcmToken: 'fcm-token',
      platform: 'ios',
    }),
    {
      appVersion: '7.0.0',
      deviceId: 'device-1',
      fcmToken: 'fcm-token',
      platform: 'ios',
    },
  );
});

test('device token params validators require device id', () => {
  assert.throws(() => removeCustomerDeviceTokenParamsValidator.parse({}));
  assert.throws(() => removeDeliveryDeviceTokenParamsValidator.parse({ deviceId: '' }));
  assert.deepEqual(removeCustomerDeviceTokenParamsValidator.parse({ deviceId: 'device-1' }), {
    deviceId: 'device-1',
  });
});
