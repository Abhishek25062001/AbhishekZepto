export const IN_APP_NOTIFICATION_TYPE = {
  ORDER_UPDATE: 'order_update',
  DELIVERY_UPDATE: 'delivery_update',
  ASSIGNMENT_UPDATE: 'assignment_update',
  PAYMENT_UPDATE: 'payment_update',
  REFUND_UPDATE: 'refund_update',
  SLA_ALERT: 'sla_alert',
  SYSTEM_ALERT: 'system_alert',
} as const;

export type InAppNotificationType =
  (typeof IN_APP_NOTIFICATION_TYPE)[keyof typeof IN_APP_NOTIFICATION_TYPE];

export const IN_APP_NOTIFICATION_TYPE_VALUES = Object.values(IN_APP_NOTIFICATION_TYPE) as [
  InAppNotificationType,
  ...InAppNotificationType[],
];
