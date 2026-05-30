export const REALTIME_EVENTS = {
  CUSTOMER_DELIVERY_PROGRESS_UPDATED: 'customer.delivery_progress_updated',
  CUSTOMER_DELIVERY_LOCATION_UPDATED: 'customer.delivery_location_updated',
  CUSTOMER_ORDER_DELIVERED: 'customer.order_delivered',

  DELIVERY_ASSIGNMENT_CREATED: 'delivery.assignment_created',
  DELIVERY_ASSIGNMENT_CANCELLED: 'delivery.assignment_cancelled',
  DELIVERY_PICKUP_UPDATED: 'delivery.pickup_updated',
  DELIVERY_STATUS_UPDATED: 'delivery.delivery_status_updated',

  VENDOR_RIDER_ARRIVED: 'vendor.rider_arrived',
  VENDOR_PICKUP_COMPLETED: 'vendor.pickup_completed',

  ADMIN_DELIVERY_ASSIGNMENT_CREATED: 'admin.delivery_assignment_created',
  ADMIN_DELIVERY_SLA_BREACH_CREATED: 'admin.delivery_sla_breach_created',
  ADMIN_DELIVERY_STATUS_CHANGED: 'admin.delivery_status_changed',
  NOTIFICATION_CREATED: 'notification.created',

  CONNECTION_AUTHENTICATED: 'connection.authenticated',
  CONNECTION_ERROR: 'connection.error',
  CONNECTION_DISCONNECTED: 'connection.disconnected',
} as const;

export type RealtimeEventName = (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];

export const REALTIME_NAMESPACE = {
  CUSTOMER: '/customer',
  DELIVERY: '/delivery',
  VENDOR: '/vendor',
  ADMIN: '/admin',
} as const;

export type RealtimeNamespace =
  (typeof REALTIME_NAMESPACE)[keyof typeof REALTIME_NAMESPACE];
