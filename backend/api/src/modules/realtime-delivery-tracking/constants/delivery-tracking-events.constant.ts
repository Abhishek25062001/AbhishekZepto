export const DELIVERY_TRACKING_REALTIME_EVENTS = {
  CUSTOMER_DELIVERY_LOCATION_UPDATED: 'customer.delivery_location_updated',
  CUSTOMER_DELIVERY_PROGRESS_UPDATED: 'customer.delivery_progress_updated',
  CUSTOMER_RIDER_REACHED_CUSTOMER: 'customer.rider_reached_customer',
  CUSTOMER_ORDER_DELIVERED: 'customer.order_delivered',
  CUSTOMER_DELIVERY_FAILED: 'customer.delivery_failed',

  ADMIN_DELIVERY_LOCATION_UPDATED: 'admin.delivery_location_updated',
  ADMIN_DELIVERY_PROGRESS_UPDATED: 'admin.delivery_progress_updated',
  ADMIN_DELIVERY_FAILED: 'admin.delivery_failed',

  DELIVERY_LOCATION_SYNC_ACKNOWLEDGED: 'delivery.location_sync_acknowledged',
  DELIVERY_LOCATION_SYNC_REJECTED: 'delivery.location_sync_rejected',
} as const;

export const DELIVERY_TRACKING_REALTIME_EVENT_VALUES = Object.values(
  DELIVERY_TRACKING_REALTIME_EVENTS,
);

export type DeliveryTrackingRealtimeEventName =
  (typeof DELIVERY_TRACKING_REALTIME_EVENTS)[keyof typeof DELIVERY_TRACKING_REALTIME_EVENTS];
