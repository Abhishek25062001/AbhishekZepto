export const CUSTOMER_REALTIME_ORDER_STATUS = {
  CREATED: 'created',
  ACCEPTED: 'accepted',
  PACKED: 'packed',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const;

export type CustomerRealtimeOrderStatus =
  (typeof CUSTOMER_REALTIME_ORDER_STATUS)[keyof typeof CUSTOMER_REALTIME_ORDER_STATUS];

export const CUSTOMER_REALTIME_EVENTS = {
  ORDER_STATUS_UPDATED: 'customer.order_status_updated',
  ORDER_ACCEPTED: 'customer.order_accepted',
  ORDER_PACKED: 'customer.order_packed',
  ORDER_READY_FOR_PICKUP: 'customer.order_ready_for_pickup',
  ORDER_OUT_FOR_DELIVERY: 'customer.order_out_for_delivery',
  ORDER_DELIVERED: 'customer.order_delivered',
  ORDER_CANCELLED: 'customer.order_cancelled',
  DELIVERY_LOCATION_UPDATED: 'customer.delivery_location_updated',
  DELIVERY_PROGRESS_UPDATED: 'customer.delivery_progress_updated',
  RIDER_REACHED_CUSTOMER: 'customer.rider_reached_customer',
  DELIVERY_FAILED: 'customer.delivery_failed',
} as const;

export type CustomerRealtimeEventName =
  (typeof CUSTOMER_REALTIME_EVENTS)[keyof typeof CUSTOMER_REALTIME_EVENTS];

export type RealtimeSocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'failed';

export type CustomerOrderRealtimeEvent = {
  eventName: CustomerRealtimeEventName;
  orderId: string;
  orderStatus: CustomerRealtimeOrderStatus;
  updatedAt: string;
  eventId?: string | null;
  emittedAt?: string | null;
};

export type DeliveryTrackingRealtimeEvent = {
  eventName: CustomerRealtimeEventName;
  orderId: string;
  assignmentId: string;
  deliveryAgentId: string;
  customerId: string;
  storeId: string;
  cityId: string;
  progressStatus: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  lastLocationUpdatedAt: string | null;
  estimatedDeliveryAt: string | null;
  updatedAt: string | null;
  eventId?: string | null;
  emittedAt?: string | null;
};

export type RealtimeSocketPayload<TData = unknown> = {
  eventName?: CustomerRealtimeEventName;
  roomName?: string;
  emittedAt?: string;
  data?: TData;
};
