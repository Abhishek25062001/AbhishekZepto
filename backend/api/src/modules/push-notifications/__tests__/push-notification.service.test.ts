import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Types } from 'mongoose';

import { env } from '../../../config/env';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import * as auditRepositoryModule from '../../audit/repositories/audit-log.repository';
import { APP_SURFACE } from '../constants/app-surface.constant';
import { PUSH_PLATFORM } from '../constants/push-platform.constant';
import { PUSH_NOTIFICATION_STATUS } from '../constants/push-status.constant';
import * as deviceTokenRepositoryModule from '../repositories/device-token.repository';
import * as pushLogRepositoryModule from '../repositories/push-notification-log.repository';
import * as firebaseProviderModule from '../providers/firebase-push.provider';
import { sendPushToUser } from '../services/push-notification.service';
import type {
  DeviceTokenDocument,
  PushNotificationLogDocument,
  PushNotificationStatus,
} from '../types/push-notification.types';

const deviceTokenRepository = deviceTokenRepositoryModule as unknown as {
  deactivateTokenByFcmToken: typeof deviceTokenRepositoryModule.deactivateTokenByFcmToken;
  findActiveTokensByUser: typeof deviceTokenRepositoryModule.findActiveTokensByUser;
};

const pushLogRepository = pushLogRepositoryModule as unknown as {
  createPushLog: typeof pushLogRepositoryModule.createPushLog;
  markPushFailed: typeof pushLogRepositoryModule.markPushFailed;
  markPushSent: typeof pushLogRepositoryModule.markPushSent;
  markPushSkipped: typeof pushLogRepositoryModule.markPushSkipped;
};

const firebaseProvider = firebaseProviderModule as unknown as {
  sendToToken: typeof firebaseProviderModule.sendToToken;
};

const auditRepository = auditRepositoryModule as unknown as {
  createAuditLog: typeof auditRepositoryModule.createAuditLog;
};

const envConfig = env as { PUSH_NOTIFICATIONS_ENABLED: boolean };
const originalPushEnabled = env.PUSH_NOTIFICATIONS_ENABLED;

const tokenId = new Types.ObjectId();
const userId = new Types.ObjectId();
const logId = new Types.ObjectId();

const activeToken: DeviceTokenDocument = {
  _id: tokenId,
  appSurface: APP_SURFACE.CUSTOMER_APP,
  appVersion: null,
  createdAt: new Date('2026-05-30T10:00:00.000Z'),
  deviceId: 'device-1',
  deviceName: null,
  fcmToken: 'fcm-token',
  isActive: true,
  lastUsedAt: new Date('2026-05-30T10:00:00.000Z'),
  platform: PUSH_PLATFORM.IOS,
  revokedAt: null,
  role: AUTH_ROLE.CUSTOMER,
  updatedAt: new Date('2026-05-30T10:00:00.000Z'),
  userId,
};

const buildLog = (
  status: PushNotificationStatus = PUSH_NOTIFICATION_STATUS.PENDING,
): PushNotificationLogDocument => ({
  _id: logId,
  appSurface: APP_SURFACE.CUSTOMER_APP,
  body: 'Body',
  createdAt: new Date('2026-05-30T10:00:00.000Z'),
  dataPayload: { orderId: 'order-1' },
  failedAt: null,
  failureReason: null,
  fcmToken: activeToken.fcmToken,
  notificationType: 'test.notification',
  providerMessageId: null,
  role: AUTH_ROLE.CUSTOMER,
  sentAt: null,
  status,
  title: 'Title',
  updatedAt: new Date('2026-05-30T10:00:00.000Z'),
  userId,
});

afterEach(() => {
  envConfig.PUSH_NOTIFICATIONS_ENABLED = originalPushEnabled;
  deviceTokenRepository.deactivateTokenByFcmToken =
    deviceTokenRepositoryModule.deactivateTokenByFcmToken;
  deviceTokenRepository.findActiveTokensByUser = deviceTokenRepositoryModule.findActiveTokensByUser;
  pushLogRepository.createPushLog = pushLogRepositoryModule.createPushLog;
  pushLogRepository.markPushFailed = pushLogRepositoryModule.markPushFailed;
  pushLogRepository.markPushSent = pushLogRepositoryModule.markPushSent;
  pushLogRepository.markPushSkipped = pushLogRepositoryModule.markPushSkipped;
  firebaseProvider.sendToToken = firebaseProviderModule.sendToToken;
  auditRepository.createAuditLog = auditRepositoryModule.createAuditLog;
});

test('sendPushToUser marks log skipped when push notifications are disabled', async () => {
  envConfig.PUSH_NOTIFICATIONS_ENABLED = false;
  let skippedReason: string | null = null;

  auditRepository.createAuditLog = async (input) => input as never;
  deviceTokenRepository.findActiveTokensByUser = async () => [activeToken];
  pushLogRepository.createPushLog = async () => buildLog();
  pushLogRepository.markPushSkipped = async (_id, reason) => {
    skippedReason = reason;
    return buildLog(PUSH_NOTIFICATION_STATUS.SKIPPED);
  };

  const results = await sendPushToUser(userId.toString(), APP_SURFACE.CUSTOMER_APP, {
    body: 'Body',
    dataPayload: { orderId: 'order-1' },
    notificationType: 'test.notification',
    title: 'Title',
  });

  assert.equal(results.length, 1);
  assert.equal(results[0]?.status, PUSH_NOTIFICATION_STATUS.SKIPPED);
  assert.equal(skippedReason, 'Push notifications disabled');
});

test('sendPushToUser marks sent log when provider succeeds', async () => {
  envConfig.PUSH_NOTIFICATIONS_ENABLED = true;

  auditRepository.createAuditLog = async (input) => input as never;
  deviceTokenRepository.findActiveTokensByUser = async () => [activeToken];
  pushLogRepository.createPushLog = async () => buildLog();
  pushLogRepository.markPushSent = async (_id, providerMessageId) => ({
    ...buildLog(PUSH_NOTIFICATION_STATUS.SENT),
    providerMessageId,
  });
  firebaseProvider.sendToToken = async () => ({
    providerMessageId: 'firebase-message-1',
    success: true,
  });

  const results = await sendPushToUser(userId.toString(), APP_SURFACE.CUSTOMER_APP, {
    body: 'Body',
    dataPayload: { orderId: 'order-1' },
    notificationType: 'test.notification',
    title: 'Title',
  });

  assert.equal(results[0]?.status, PUSH_NOTIFICATION_STATUS.SENT);
  assert.equal(results[0]?.providerMessageId, 'firebase-message-1');
});

test('sendPushToUser deactivates invalid FCM tokens after provider failure', async () => {
  envConfig.PUSH_NOTIFICATIONS_ENABLED = true;
  let deactivatedToken: string | null = null;

  auditRepository.createAuditLog = async (input) => input as never;
  deviceTokenRepository.findActiveTokensByUser = async () => [activeToken];
  deviceTokenRepository.deactivateTokenByFcmToken = async (fcmToken) => {
    deactivatedToken = fcmToken;
    return { ...activeToken, isActive: false, revokedAt: new Date('2026-05-30T11:00:00.000Z') };
  };
  pushLogRepository.createPushLog = async () => buildLog();
  pushLogRepository.markPushFailed = async (_id, failureReason) => ({
    ...buildLog(PUSH_NOTIFICATION_STATUS.FAILED),
    failureReason,
  });
  firebaseProvider.sendToToken = async () => ({
    failureReason: 'INVALID_FCM_TOKEN',
    invalidToken: true,
    success: false,
  });

  const results = await sendPushToUser(userId.toString(), APP_SURFACE.CUSTOMER_APP, {
    body: 'Body',
    dataPayload: { orderId: 'order-1' },
    notificationType: 'test.notification',
    title: 'Title',
  });

  assert.equal(results[0]?.status, PUSH_NOTIFICATION_STATUS.FAILED);
  assert.equal(results[0]?.failureReason, 'INVALID_FCM_TOKEN');
  assert.equal(deactivatedToken, 'fcm-token');
});
