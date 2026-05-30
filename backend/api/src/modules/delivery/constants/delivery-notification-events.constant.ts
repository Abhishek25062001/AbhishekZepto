// ---------------------------------------------------------------------------
// Delivery Notification Placeholder Constants
// Mirrors: backend/api/src/modules/orders/constants/order-notification-events.constant.ts
// ---------------------------------------------------------------------------

export const DELIVERY_NOTIFICATION_EVENTS = {
  ASSIGNED: 'assigned',
  ARRIVED_AT_STORE: 'arrived_at_store',
  PICKED_UP: 'picked_up',
  ARRIVED_AT_CUSTOMER: 'arrived_at_customer',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  SLA_BREACHED: 'sla_breached',
} as const;

export const DELIVERY_NOTIFICATION_EVENT_VALUES = Object.values(DELIVERY_NOTIFICATION_EVENTS);

export type DeliveryNotificationEvent = (typeof DELIVERY_NOTIFICATION_EVENT_VALUES)[number];

export const DELIVERY_NOTIFICATION_RECIPIENTS = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  AGENT: 'agent',
} as const;

export const DELIVERY_NOTIFICATION_RECIPIENT_VALUES = Object.values(
  DELIVERY_NOTIFICATION_RECIPIENTS,
);

export type DeliveryNotificationRecipient =
  (typeof DELIVERY_NOTIFICATION_RECIPIENT_VALUES)[number];

export const DELIVERY_NOTIFICATION_STATUSES = {
  QUEUED_PLACEHOLDER: 'queued_placeholder',
  SKIPPED_PLACEHOLDER: 'skipped_placeholder',
} as const;

export const DELIVERY_NOTIFICATION_STATUS_VALUES = Object.values(
  DELIVERY_NOTIFICATION_STATUSES,
);

export type DeliveryNotificationStatus =
  (typeof DELIVERY_NOTIFICATION_STATUS_VALUES)[number];
