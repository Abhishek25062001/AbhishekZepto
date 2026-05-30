import {
  CUSTOMER_REALTIME_EVENTS,
  CUSTOMER_REALTIME_ORDER_STATUS,
} from '../types/realtime-order.types';
import type {
  CustomerOrderRealtimeEvent,
  CustomerRealtimeEventName,
  CustomerRealtimeOrderStatus,
  RealtimeSocketPayload,
} from '../types/realtime-order.types';

const ORDER_EVENT_NAMES = new Set<CustomerRealtimeEventName>([
  CUSTOMER_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
  CUSTOMER_REALTIME_EVENTS.ORDER_ACCEPTED,
  CUSTOMER_REALTIME_EVENTS.ORDER_PACKED,
  CUSTOMER_REALTIME_EVENTS.ORDER_READY_FOR_PICKUP,
  CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY,
  CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
  CUSTOMER_REALTIME_EVENTS.ORDER_CANCELLED,
]);

const STATUS_BY_BACKEND_STATUS: Record<string, CustomerRealtimeOrderStatus> = {
  placed: CUSTOMER_REALTIME_ORDER_STATUS.CREATED,
  created: CUSTOMER_REALTIME_ORDER_STATUS.CREATED,
  accepted: CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED,
  picking: CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED,
  packing: CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
  packed: CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
  ready_for_pickup: CUSTOMER_REALTIME_ORDER_STATUS.READY_FOR_PICKUP,
  shipped: CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY,
  out_for_delivery: CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY,
  delivered: CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED,
  cancelled: CUSTOMER_REALTIME_ORDER_STATUS.CANCELLED,
  failed: CUSTOMER_REALTIME_ORDER_STATUS.FAILED,
};

const STATUS_BY_EVENT_NAME: Partial<
  Record<CustomerRealtimeEventName, CustomerRealtimeOrderStatus>
> = {
  [CUSTOMER_REALTIME_EVENTS.ORDER_ACCEPTED]: CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED,
  [CUSTOMER_REALTIME_EVENTS.ORDER_PACKED]: CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
  [CUSTOMER_REALTIME_EVENTS.ORDER_READY_FOR_PICKUP]:
    CUSTOMER_REALTIME_ORDER_STATUS.READY_FOR_PICKUP,
  [CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY]:
    CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY,
  [CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED]: CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED,
  [CUSTOMER_REALTIME_EVENTS.ORDER_CANCELLED]: CUSTOMER_REALTIME_ORDER_STATUS.CANCELLED,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

const toStringValue = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const isCustomerRealtimeEventName = (
  value: unknown,
): value is CustomerRealtimeEventName =>
  typeof value === 'string' &&
  Object.values(CUSTOMER_REALTIME_EVENTS).includes(value as CustomerRealtimeEventName);

const normalizeTimestamp = (value: unknown): string | null => {
  const timestamp = toStringValue(value);
  if (!timestamp) {
    return null;
  }

  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
};

const normalizeOrderStatus = (
  eventName: CustomerRealtimeEventName,
  data: Record<string, unknown>,
): CustomerRealtimeOrderStatus | null => {
  const rawStatus = toStringValue(data.orderStatus) ?? toStringValue(data.status);
  if (rawStatus && STATUS_BY_BACKEND_STATUS[rawStatus]) {
    return STATUS_BY_BACKEND_STATUS[rawStatus];
  }

  return STATUS_BY_EVENT_NAME[eventName] ?? null;
};

export const mapRealtimeOrderEventPayload = (
  payload: RealtimeSocketPayload,
  fallbackEventName: CustomerRealtimeEventName,
): CustomerOrderRealtimeEvent | null => {
  const eventName = isCustomerRealtimeEventName(payload.eventName)
    ? payload.eventName
    : fallbackEventName;
  if (!ORDER_EVENT_NAMES.has(eventName)) {
    return null;
  }

  const data = isRecord(payload.data) ? payload.data : {};
  const orderId = toStringValue(data.orderId);
  const orderStatus = normalizeOrderStatus(eventName, data);
  const updatedAt =
    normalizeTimestamp(data.updatedAt) ?? normalizeTimestamp(payload.emittedAt);

  if (!orderId || !orderStatus || !updatedAt) {
    return null;
  }

  return {
    eventName,
    orderId,
    orderStatus,
    updatedAt,
    eventId: toStringValue(data.eventId),
    emittedAt: normalizeTimestamp(payload.emittedAt),
  };
};
