export const IN_APP_NOTIFICATION_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type InAppNotificationPriority =
  (typeof IN_APP_NOTIFICATION_PRIORITY)[keyof typeof IN_APP_NOTIFICATION_PRIORITY];

export const IN_APP_NOTIFICATION_PRIORITY_VALUES = Object.values(
  IN_APP_NOTIFICATION_PRIORITY,
) as [InAppNotificationPriority, ...InAppNotificationPriority[]];
