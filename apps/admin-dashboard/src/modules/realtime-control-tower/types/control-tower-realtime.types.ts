import type { AdminOrderListItem } from '../../orders/types/admin-orders.types';

export type AdminRealtimeDeliveryStatus =
  | 'pending_assignment'
  | 'assigned'
  | 'en_route_to_store'
  | 'arrived_at_store'
  | 'picked_up'
  | 'en_route_to_customer'
  | 'arrived_at_customer'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export const ADMIN_REALTIME_EVENTS = {
  ORDER_CREATED: 'admin.order_created',
  ORDER_STATUS_UPDATED: 'admin.order_status_updated',
  ORDER_DELAYED: 'admin.order_delayed',
  ORDER_CANCELLED: 'admin.order_cancelled',
  DELIVERY_ASSIGNMENT_CREATED: 'admin.delivery_assignment_created',
  DELIVERY_STATUS_CHANGED: 'admin.delivery_status_changed',
  DELIVERY_LOCATION_UPDATED: 'admin.delivery_location_updated',
  DELIVERY_PROGRESS_UPDATED: 'admin.delivery_progress_updated',
  DELIVERY_FAILED: 'admin.delivery_failed',
  DELIVERY_SLA_BREACH_CREATED: 'admin.delivery_sla_breach_created',
} as const;

export type AdminRealtimeEventName =
  (typeof ADMIN_REALTIME_EVENTS)[keyof typeof ADMIN_REALTIME_EVENTS];

export type AdminSocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'failed';

export type AdminRealtimeSocketPayload<TData = unknown> = {
  eventName?: AdminRealtimeEventName;
  emittedAt?: string;
  data?: TData;
};

export type AdminControlTowerMetricSnapshot = {
  activeOrdersCount: number;
  assignedRidersCount: number;
  outForDeliveryCount: number;
  delayedOrdersCount: number;
  openSlaBreachesCount: number;
};

export type AdminLiveOrder = AdminOrderListItem & {
  updatedAt: string;
};

export type AdminOrderRealtimeEvent = {
  eventName:
    | typeof ADMIN_REALTIME_EVENTS.ORDER_CREATED
    | typeof ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED
    | typeof ADMIN_REALTIME_EVENTS.ORDER_DELAYED
    | typeof ADMIN_REALTIME_EVENTS.ORDER_CANCELLED;
  orderId: string;
  cityId: string | null;
  orderStatus: AdminOrderListItem['orderStatus'];
  paymentStatus: AdminOrderListItem['paymentStatus'];
  updatedAt: string;
  emittedAt: string | null;
  eventId: string | null;
  order: AdminLiveOrder | null;
};

export type AdminDeliveryLocation = {
  deliveryId: string;
  orderId: string;
  cityId: string | null;
  deliveryAgentId: string | null;
  deliveryStatus: AdminRealtimeDeliveryStatus;
  latitude: number | null;
  longitude: number | null;
  heading: number | null;
  speed: number | null;
  updatedAt: string;
};

export type AdminDeliveryRealtimeEvent = {
  eventName:
    | typeof ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED
    | typeof ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED
    | typeof ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED
    | typeof ADMIN_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED
    | typeof ADMIN_REALTIME_EVENTS.DELIVERY_FAILED;
  deliveryId: string;
  orderId: string;
  cityId: string | null;
  deliveryAgentId: string | null;
  deliveryStatus: AdminRealtimeDeliveryStatus;
  updatedAt: string;
  emittedAt: string | null;
  eventId: string | null;
  delivery: AdminDeliveryLocation | null;
};

export type AdminSlaRealtimeEvent = {
  eventName: typeof ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED;
  breachId: string;
  orderId: string;
  assignmentId: string | null;
  deliveryId: string | null;
  cityId: string | null;
  breachType: string;
  escalationLevel: string | null;
  breachedAt: string;
  emittedAt: string | null;
  eventId: string | null;
};

export type AdminRealtimeEvent =
  | AdminOrderRealtimeEvent
  | AdminDeliveryRealtimeEvent
  | AdminSlaRealtimeEvent;

export type AdminControlTowerSnapshot = AdminControlTowerMetricSnapshot & {
  activeOrders: AdminLiveOrder[];
  activeDeliveries: AdminDeliveryLocation[];
  openSlaBreaches: AdminSlaRealtimeEvent[];
};

export type AdminControlTowerSnapshotQuery = {
  cityId?: string;
};
