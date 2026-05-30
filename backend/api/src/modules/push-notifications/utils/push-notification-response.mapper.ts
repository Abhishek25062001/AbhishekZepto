import type {
  DeviceTokenDocument,
  PushNotificationLogDocument,
} from '../types/push-notification.types';

const maskToken = (token: string | null): string | null => {
  if (!token) {
    return null;
  }

  if (token.length <= 10) {
    return '***';
  }

  return `${token.slice(0, 6)}***${token.slice(-4)}`;
};

export const mapDeviceTokenResponse = (token: DeviceTokenDocument) => ({
  appSurface: token.appSurface,
  appVersion: token.appVersion,
  createdAt: token.createdAt.toISOString(),
  deviceId: token.deviceId,
  deviceName: token.deviceName,
  isActive: token.isActive,
  lastUsedAt: token.lastUsedAt.toISOString(),
  platform: token.platform,
  revokedAt: token.revokedAt?.toISOString() ?? null,
  tokenId: token._id.toString(),
  updatedAt: token.updatedAt.toISOString(),
});

export const mapPushLogResponse = (log: PushNotificationLogDocument) => ({
  appSurface: log.appSurface,
  body: log.body,
  createdAt: log.createdAt.toISOString(),
  dataPayload: log.dataPayload,
  failedAt: log.failedAt?.toISOString() ?? null,
  failureReason: log.failureReason,
  fcmToken: maskToken(log.fcmToken),
  logId: log._id.toString(),
  notificationType: log.notificationType,
  providerMessageId: log.providerMessageId,
  role: log.role,
  sentAt: log.sentAt?.toISOString() ?? null,
  status: log.status,
  title: log.title,
  updatedAt: log.updatedAt.toISOString(),
  userId: log.userId.toString(),
});
