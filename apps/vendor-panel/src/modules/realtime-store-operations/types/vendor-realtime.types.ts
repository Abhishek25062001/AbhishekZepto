import type {
  VendorOrderListItem,
  VendorOrderStatus,
} from '../../orders/types/vendor-orders.types';

export const VENDOR_REALTIME_EVENTS = {
  ORDER_CREATED: 'vendor.order_created',
  ORDER_STATUS_UPDATED: 'vendor.order_status_updated',
  ORDER_CANCELLED: 'vendor.order_cancelled',
  RIDER_ARRIVED: 'vendor.rider_arrived',
  PICKUP_COMPLETED: 'vendor.pickup_completed',
} as const;

export type VendorRealtimeEventName =
  (typeof VENDOR_REALTIME_EVENTS)[keyof typeof VENDOR_REALTIME_EVENTS];

export type VendorSocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'failed';

export type VendorRealtimeSocketPayload<TData = unknown> = {
  eventName?: VendorRealtimeEventName;
  emittedAt?: string;
  data?: TData;
};

export type VendorOrderRealtimeEvent = {
  eventName:
    | typeof VENDOR_REALTIME_EVENTS.ORDER_CREATED
    | typeof VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED
    | typeof VENDOR_REALTIME_EVENTS.ORDER_CANCELLED;
  orderId: string;
  storeId: string;
  orderStatus: VendorOrderStatus;
  totalAmount: number;
  itemCount: number;
  updatedAt: string;
  emittedAt: string | null;
  eventId: string | null;
  order: VendorOrderListItem | null;
};

export type VendorPickupRealtimeEvent = {
  eventName:
    | typeof VENDOR_REALTIME_EVENTS.RIDER_ARRIVED
    | typeof VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED;
  orderId: string;
  assignmentId: string;
  riderId: string;
  pickupStatus: 'arrived_at_store' | 'pickup_completed';
  arrivedAt: string | null;
  pickupCompletedAt: string | null;
  updatedAt: string;
  emittedAt: string | null;
  eventId: string | null;
};

export type VendorRealtimeEvent =
  | VendorOrderRealtimeEvent
  | VendorPickupRealtimeEvent;
