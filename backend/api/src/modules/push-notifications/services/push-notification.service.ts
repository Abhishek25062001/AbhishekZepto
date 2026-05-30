import { Types } from 'mongoose';

import { env } from '../../../config/env';
import { AUDIT_EVENTS, writeAuditLog } from '../../audit';
import { findActiveTokensByUser, deactivateTokenByFcmToken } from '../repositories/device-token.repository';
import {
  createPushLog,
  markPushFailed,
  markPushSent,
  markPushSkipped,
} from '../repositories/push-notification-log.repository';
import { sendToToken } from '../providers/firebase-push.provider';
import type { AppSurface } from '../constants/app-surface.constant';
import type { SendPushInput } from '../types/push-notification.types';

export const sendPushToUser = async (
  userId: string,
  appSurface: AppSurface,
  notificationPayload: SendPushInput,
) => {
  const activeTokens = await findActiveTokensByUser(userId, appSurface);
  const results = [];

  for (const token of activeTokens) {
    const log = await createPushLog({
      ...notificationPayload,
      appSurface,
      fcmToken: token.fcmToken,
      role: token.role,
      userId: new Types.ObjectId(userId),
    });

    if (!env.PUSH_NOTIFICATIONS_ENABLED) {
      results.push(await markPushSkipped(log._id, 'Push notifications disabled'));
      continue;
    }

    const providerResult = await sendToToken(
      token.fcmToken,
      notificationPayload.title,
      notificationPayload.body,
      notificationPayload.dataPayload,
    );

    if (providerResult.success) {
      const sentLog = await markPushSent(log._id, providerResult.providerMessageId);
      void writeAuditLog({
        actorId: null,
        actorRole: 'system',
        actorSurface: 'backend',
        cityId: null,
        entityId: log._id,
        entityType: 'push_notification_log',
        eventType: AUDIT_EVENTS.PUSH_NOTIFICATION_SENT,
        ipAddress: null,
        metadata: { appSurface, notificationType: notificationPayload.notificationType },
        requestId: null,
        status: 'success',
        storeId: null,
        traceId: null,
        userAgent: null,
        vendorId: null,
      });
      results.push(sentLog);
      continue;
    }

    if (providerResult.invalidToken) {
      await deactivateTokenByFcmToken(token.fcmToken);
    }

    const failedLog = await markPushFailed(log._id, providerResult.failureReason);
    void writeAuditLog({
      actorId: null,
      actorRole: 'system',
      actorSurface: 'backend',
      cityId: null,
      entityId: log._id,
      entityType: 'push_notification_log',
      eventType: AUDIT_EVENTS.PUSH_NOTIFICATION_FAILED,
      ipAddress: null,
      metadata: {
        appSurface,
        failureReason: providerResult.failureReason,
        notificationType: notificationPayload.notificationType,
      },
      requestId: null,
      status: 'failed',
      storeId: null,
      traceId: null,
      userAgent: null,
      vendorId: null,
    });
    results.push(failedLog);
  }

  return results.filter(Boolean);
};
