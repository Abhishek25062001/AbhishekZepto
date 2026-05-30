import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';

import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import * as auditRepositoryModule from '../../audit/repositories/audit-log.repository';
import { APP_SURFACE } from '../constants/app-surface.constant';
import { PUSH_PLATFORM } from '../constants/push-platform.constant';
import * as deviceTokenRepositoryModule from '../repositories/device-token.repository';
import {
  registerCustomerDeviceToken,
  registerDeliveryDeviceToken,
  removeDeviceToken,
} from '../services/device-token.service';
import type { DeviceTokenDocument } from '../types/push-notification.types';

const deviceTokenRepository = deviceTokenRepositoryModule as unknown as {
  revokeDeviceToken: typeof deviceTokenRepositoryModule.revokeDeviceToken;
  upsertDeviceToken: typeof deviceTokenRepositoryModule.upsertDeviceToken;
};

const auditRepository = auditRepositoryModule as unknown as {
  createAuditLog: typeof auditRepositoryModule.createAuditLog;
};

const buildToken = (overrides: Partial<DeviceTokenDocument> = {}): DeviceTokenDocument => ({
  _id: new Types.ObjectId(),
  appSurface: APP_SURFACE.CUSTOMER_APP,
  appVersion: '7.0.0',
  createdAt: new Date('2026-05-30T10:00:00.000Z'),
  deviceId: 'device-1',
  deviceName: 'Test Device',
  fcmToken: 'fcm-token',
  isActive: true,
  lastUsedAt: new Date('2026-05-30T10:00:00.000Z'),
  platform: PUSH_PLATFORM.IOS,
  revokedAt: null,
  role: AUTH_ROLE.CUSTOMER,
  updatedAt: new Date('2026-05-30T10:00:00.000Z'),
  userId: new Types.ObjectId(),
  ...overrides,
});

afterEach(() => {
  deviceTokenRepository.revokeDeviceToken = deviceTokenRepositoryModule.revokeDeviceToken;
  deviceTokenRepository.upsertDeviceToken = deviceTokenRepositoryModule.upsertDeviceToken;
  auditRepository.createAuditLog = auditRepositoryModule.createAuditLog;
});

test('registerCustomerDeviceToken stores customer app surface and role', async () => {
  const userId = new Types.ObjectId().toString();
  let capturedRole: string | null = null;
  let capturedSurface: string | null = null;

  auditRepository.createAuditLog = async (input) => input as never;
  deviceTokenRepository.upsertDeviceToken = async (payload) => {
    capturedRole = payload.role;
    capturedSurface = payload.appSurface;
    return buildToken({
      appSurface: payload.appSurface,
      role: payload.role,
      userId: payload.userId,
    });
  };

  const token = await registerCustomerDeviceToken(userId, {
    deviceId: 'device-1',
    fcmToken: 'fcm-token',
    platform: PUSH_PLATFORM.IOS,
  });

  assert.equal(capturedRole, AUTH_ROLE.CUSTOMER);
  assert.equal(capturedSurface, APP_SURFACE.CUSTOMER_APP);
  assert.equal(token.role, AUTH_ROLE.CUSTOMER);
});

test('registerDeliveryDeviceToken stores delivery app surface and role', async () => {
  const userId = new Types.ObjectId().toString();

  auditRepository.createAuditLog = async (input) => input as never;
  deviceTokenRepository.upsertDeviceToken = async (payload) =>
    buildToken({
      appSurface: payload.appSurface,
      role: payload.role,
      userId: payload.userId,
    });

  const token = await registerDeliveryDeviceToken(userId, {
    deviceId: 'device-2',
    fcmToken: 'delivery-fcm-token',
    platform: PUSH_PLATFORM.ANDROID,
  });

  assert.equal(token.role, AUTH_ROLE.DELIVERY_AGENT);
  assert.equal(token.appSurface, APP_SURFACE.DELIVERY_AGENT_APP);
});

test('removeDeviceToken revokes by user and device id', async () => {
  const userId = new Types.ObjectId().toString();
  let capturedDeviceId: string | null = null;

  auditRepository.createAuditLog = async (input) => input as never;
  deviceTokenRepository.revokeDeviceToken = async (_userId, deviceId) => {
    capturedDeviceId = deviceId;
    return buildToken({ deviceId, isActive: false, revokedAt: new Date('2026-05-30T11:00:00.000Z') });
  };

  const token = await removeDeviceToken(userId, 'device-3');

  assert.equal(capturedDeviceId, 'device-3');
  assert.equal(token?.isActive, false);
  assert.ok(token?.revokedAt);
});
