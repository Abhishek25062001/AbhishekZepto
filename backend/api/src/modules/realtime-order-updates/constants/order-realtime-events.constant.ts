export const ORDER_REALTIME_EVENTS = {
  CUSTOMER_ORDER_STATUS_UPDATED: 'customer.order_status_updated',
  CUSTOMER_ORDER_ACCEPTED: 'customer.order_accepted',
  CUSTOMER_ORDER_PACKED: 'customer.order_packed',
  CUSTOMER_ORDER_READY_FOR_PICKUP: 'customer.order_ready_for_pickup',
  CUSTOMER_ORDER_OUT_FOR_DELIVERY: 'customer.order_out_for_delivery',
  CUSTOMER_ORDER_DELIVERED: 'customer.order_delivered',
  CUSTOMER_ORDER_CANCELLED: 'customer.order_cancelled',

  VENDOR_ORDER_CREATED: 'vendor.order_created',
  VENDOR_ORDER_STATUS_UPDATED: 'vendor.order_status_updated',
  VENDOR_ORDER_CANCELLED: 'vendor.order_cancelled',

  ADMIN_ORDER_CREATED: 'admin.order_created',
  ADMIN_ORDER_STATUS_UPDATED: 'admin.order_status_updated',
  ADMIN_ORDER_DELAYED: 'admin.order_delayed',
  ADMIN_ORDER_CANCELLED: 'admin.order_cancelled',
} as const;

export const ORDER_REALTIME_EVENT_VALUES = Object.values(ORDER_REALTIME_EVENTS);

export type OrderRealtimeEventName =
  (typeof ORDER_REALTIME_EVENTS)[keyof typeof ORDER_REALTIME_EVENTS];
