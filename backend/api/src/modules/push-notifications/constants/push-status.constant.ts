export const PUSH_NOTIFICATION_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  SKIPPED: 'skipped',
} as const;

export type PushNotificationStatus =
  (typeof PUSH_NOTIFICATION_STATUS)[keyof typeof PUSH_NOTIFICATION_STATUS];

export const PUSH_NOTIFICATION_STATUS_VALUES = Object.values(
  PUSH_NOTIFICATION_STATUS,
) as [PushNotificationStatus, ...PushNotificationStatus[]];
