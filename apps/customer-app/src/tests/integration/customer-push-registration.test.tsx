import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { apiClient } from '../../services/api/client';
import {
  registerCustomerDeviceToken,
  removeCustomerDeviceToken,
} from '../../modules/push-notifications/services/customer-device-token.api';

const client = apiClient as unknown as {
  delete: typeof apiClient.delete;
  post: typeof apiClient.post;
};

const originalDelete = apiClient.delete;
const originalPost = apiClient.post;

afterEach(() => {
  client.delete = originalDelete;
  client.post = originalPost;
});

test('customer push registration posts device token after login', async () => {
  let capturedUrl: string | null = null;
  let capturedBody: unknown = null;

  client.post = async (url, body) => {
    capturedUrl = url;
    capturedBody = body;
    return { data: { data: { deviceId: 'device-1' }, message: 'ok', success: true } } as never;
  };

  await registerCustomerDeviceToken({
    deviceId: 'device-1',
    fcmToken: 'fcm-token',
    platform: 'android',
  });

  assert.equal(capturedUrl, '/api/v1/customer/me/device-token');
  assert.deepEqual(capturedBody, {
    deviceId: 'device-1',
    fcmToken: 'fcm-token',
    platform: 'android',
  });
});

test('customer push registration revokes token on logout', async () => {
  let capturedUrl: string | null = null;

  client.delete = async (url) => {
    capturedUrl = url;
    return { data: { data: null, message: 'ok', success: true } } as never;
  };

  await removeCustomerDeviceToken('device-1');

  assert.equal(capturedUrl, '/api/v1/customer/me/device-token/device-1');
});
