import type {
  AdminOrderPackingStatus,
  AdminOrderPickerStatus,
  AdminOrderStatus,
  AdminOrderStoreStatus,
} from '../../orders/types/admin-orders.types';
import {
  ADMIN_REALTIME_EVENTS,
  type AdminRealtimeDeliveryStatus,
  type AdminDeliveryLocation,
  type AdminDeliveryRealtimeEvent,
  type AdminLiveOrder,
  type AdminOrderRealtimeEvent,
  type AdminRealtimeEvent,
  type AdminRealtimeEventName,
  type AdminRealtimeSocketPayload,
  type AdminSlaRealtimeEvent,
} from '../types/control-tower-realtime.types';

const ADMIN_ORDER_STATUSES = new Set<AdminOrderStatus>([
  'placed',
  'accepted',
  'picking',
  'packing',
  'ready_for_pickup',
  'shipped',
  'delivered',
  'failed',
  'cancelled',
]);

const ADMIN_STORE_STATUSES = new Set<AdminOrderStoreStatus>([
  'pending_acceptance',
  'accepted',
  'rejected',
]);

const ADMIN_PICKER_STATUSES = new Set<Exclude<AdminOrderPickerStatus, null>>([
  'in_progress',
  'completed',
]);

const ADMIN_PACKING_STATUSES = new Set<Exclude<AdminOrderPackingStatus, null>>([
  'in_progress',
  'completed',
  'ready_for_pickup',
]);

const ADMIN_DELIVERY_STATUSES = new Set<AdminRealtimeDeliveryStatus>([
  'pending_assignment',
  'assigned',
  'en_route_to_store',
  'arrived_at_store',
  'picked_up',
  'en_route_to_customer',
  'arrived_at_customer',
  'delivered',
  'failed',
  'cancelled',
]);

const ORDER_EVENT_NAMES = new Set<AdminRealtimeEventName>([
  ADMIN_REALTIME_EVENTS.ORDER_CREATED,
  ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
  ADMIN_REALTIME_EVENTS.ORDER_DELAYED,
  ADMIN_REALTIME_EVENTS.ORDER_CANCELLED,
]);

const DELIVERY_EVENT_NAMES = new Set<AdminRealtimeEventName>([
  ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
  ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED,
  ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  ADMIN_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED,
  ADMIN_REALTIME_EVENTS.DELIVERY_FAILED,
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toStringValue = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const toNumberValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const normalizeTimestamp = (value: unknown): string | null => {
  const timestamp = toStringValue(value);
  if (!timestamp) {
    return null;
  }

  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
};

const isAdminRealtimeEventName = (
  value: unknown,
): value is AdminRealtimeEventName =>
  typeof value === 'string' &&
  Object.values(ADMIN_REALTIME_EVENTS).includes(
    value as AdminRealtimeEventName,
  );

const normalizeOrderStatus = (
  eventName: AdminRealtimeEventName,
  data: Record<string, unknown>,
): AdminOrderStatus | null => {
  const rawStatus =
    toStringValue(data.orderStatus) ?? toStringValue(data.status);

  if (rawStatus && ADMIN_ORDER_STATUSES.has(rawStatus as AdminOrderStatus)) {
    return rawStatus as AdminOrderStatus;
  }

  if (eventName === ADMIN_REALTIME_EVENTS.ORDER_CANCELLED) {
    return 'cancelled';
  }

  return null;
};

const normalizeStoreStatus = (
  data: Record<string, unknown>,
  orderStatus: AdminOrderStatus,
): AdminOrderStoreStatus => {
  const rawStatus = toStringValue(data.storeStatus);
  if (rawStatus && ADMIN_STORE_STATUSES.has(rawStatus as AdminOrderStoreStatus)) {
    return rawStatus as AdminOrderStoreStatus;
  }

  return orderStatus === 'placed' ? 'pending_acceptance' : 'accepted';
};

const normalizePickerStatus = (value: unknown): AdminOrderPickerStatus => {
  const rawStatus = toStringValue(value);
  return rawStatus && ADMIN_PICKER_STATUSES.has(rawStatus as Exclude<AdminOrderPickerStatus, null>)
    ? (rawStatus as AdminOrderPickerStatus)
    : null;
};

const normalizePackingStatus = (value: unknown): AdminOrderPackingStatus => {
  const rawStatus = toStringValue(value);
  return rawStatus && ADMIN_PACKING_STATUSES.has(rawStatus as Exclude<AdminOrderPackingStatus, null>)
    ? (rawStatus as AdminOrderPackingStatus)
    : null;
};

const normalizeDeliveryStatus = (
  eventName: AdminRealtimeEventName,
  data: Record<string, unknown>,
): AdminRealtimeDeliveryStatus | null => {
  const rawStatus =
    toStringValue(data.deliveryStatus) ??
    toStringValue(data.progressStatus) ??
    toStringValue(data.status);

  if (rawStatus && ADMIN_DELIVERY_STATUSES.has(rawStatus as AdminRealtimeDeliveryStatus)) {
    return rawStatus as AdminRealtimeDeliveryStatus;
  }

  if (eventName === ADMIN_REALTIME_EVENTS.DELIVERY_FAILED) {
    return 'failed';
  }

  if (eventName === ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED) {
    return 'assigned';
  }

  return null;
};

const getUpdatedAt = (
  payload: AdminRealtimeSocketPayload,
  data: Record<string, unknown>,
): string | null =>
  normalizeTimestamp(data.updatedAt) ??
  normalizeTimestamp(data.lastLocationUpdatedAt) ??
  normalizeTimestamp(data.breachedAt) ??
  normalizeTimestamp(data.createdAt) ??
  normalizeTimestamp(payload.emittedAt);

const buildAdminLiveOrder = (
  data: Record<string, unknown>,
  orderId: string,
  orderStatus: AdminOrderStatus,
  updatedAt: string,
): AdminLiveOrder | null => {
  const customerId = toStringValue(data.customerId);
  const storeId = toStringValue(data.storeId);
  const grandTotal =
    toNumberValue(data.grandTotal) ??
    toNumberValue(data.totalAmount) ??
    toNumberValue(data.amount);
  const itemCount = toNumberValue(data.itemCount);

  if (!customerId || !storeId || grandTotal === null || itemCount === null) {
    return null;
  }

  return {
    orderId,
    orderNumber: toStringValue(data.orderNumber) ?? orderId,
    customerId,
    storeId,
    cityId: toStringValue(data.cityId),
    orderStatus,
    storeStatus: normalizeStoreStatus(data, orderStatus),
    pickerStatus: normalizePickerStatus(data.pickerStatus),
    packingStatus: normalizePackingStatus(data.packingStatus),
    paymentStatus: 'paid',
    grandTotal,
    currency: toStringValue(data.currency) ?? 'INR',
    placedAt:
      normalizeTimestamp(data.placedAt) ??
      normalizeTimestamp(data.createdAt) ??
      updatedAt,
    createdAt: normalizeTimestamp(data.createdAt) ?? updatedAt,
    acceptedAt: normalizeTimestamp(data.acceptedAt),
    itemCount,
    slaStatus: toStringValue(data.slaStatus),
    slaBreachedStage: toStringValue(data.slaBreachedStage),
    updatedAt,
  };
};

const mapOrderEvent = (
  eventName: AdminRealtimeEventName,
  payload: AdminRealtimeSocketPayload,
  data: Record<string, unknown>,
): AdminOrderRealtimeEvent | null => {
  const orderId = toStringValue(data.orderId) ?? toStringValue(data._id);
  const orderStatus = normalizeOrderStatus(eventName, data);
  const updatedAt = getUpdatedAt(payload, data);

  if (!orderId || !orderStatus || !updatedAt) {
    return null;
  }

  return {
    eventName: eventName as AdminOrderRealtimeEvent['eventName'],
    orderId,
    cityId: toStringValue(data.cityId),
    orderStatus,
    paymentStatus: 'paid',
    updatedAt,
    emittedAt: normalizeTimestamp(payload.emittedAt),
    eventId: toStringValue(data.eventId),
    order: buildAdminLiveOrder(data, orderId, orderStatus, updatedAt),
  };
};

const mapDeliveryEvent = (
  eventName: AdminRealtimeEventName,
  payload: AdminRealtimeSocketPayload,
  data: Record<string, unknown>,
): AdminDeliveryRealtimeEvent | null => {
  const deliveryId =
    toStringValue(data.deliveryId) ??
    toStringValue(data.assignmentId) ??
    toStringValue(data._id);
  const orderId = toStringValue(data.orderId);
  const deliveryStatus = normalizeDeliveryStatus(eventName, data);
  const updatedAt = getUpdatedAt(payload, data);

  if (!deliveryId || !orderId || !deliveryStatus || !updatedAt) {
    return null;
  }

  const delivery: AdminDeliveryLocation = {
    deliveryId,
    orderId,
    cityId: toStringValue(data.cityId),
    deliveryAgentId:
      toStringValue(data.deliveryAgentId) ?? toStringValue(data.riderId),
    deliveryStatus,
    latitude:
      toNumberValue(data.latitude) ?? toNumberValue(data.currentLatitude),
    longitude:
      toNumberValue(data.longitude) ?? toNumberValue(data.currentLongitude),
    heading: toNumberValue(data.heading),
    speed: toNumberValue(data.speed),
    updatedAt,
  };

  return {
    eventName: eventName as AdminDeliveryRealtimeEvent['eventName'],
    deliveryId,
    orderId,
    cityId: delivery.cityId,
    deliveryAgentId: delivery.deliveryAgentId,
    deliveryStatus,
    updatedAt,
    emittedAt: normalizeTimestamp(payload.emittedAt),
    eventId: toStringValue(data.eventId),
    delivery,
  };
};

const mapSlaEvent = (
  payload: AdminRealtimeSocketPayload,
  data: Record<string, unknown>,
): AdminSlaRealtimeEvent | null => {
  const breachId =
    toStringValue(data.breachId) ??
    toStringValue(data.slaBreachId) ??
    toStringValue(data.eventId);
  const orderId = toStringValue(data.orderId);
  const breachedAt =
    normalizeTimestamp(data.breachedAt) ??
    normalizeTimestamp(data.createdAt) ??
    normalizeTimestamp(payload.emittedAt);

  if (!breachId || !orderId || !breachedAt) {
    return null;
  }

  return {
    eventName: ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
    breachId,
    orderId,
    assignmentId:
      toStringValue(data.assignmentId) ?? toStringValue(data.deliveryAssignmentId),
    deliveryId: toStringValue(data.deliveryId),
    cityId: toStringValue(data.cityId),
    breachType:
      toStringValue(data.breachType) ??
      toStringValue(data.slaType) ??
      'delivery_sla',
    escalationLevel: toStringValue(data.escalationLevel),
    breachedAt,
    emittedAt: normalizeTimestamp(payload.emittedAt),
    eventId: toStringValue(data.eventId),
  };
};

export const mapAdminRealtimeEventPayload = (
  payload: AdminRealtimeSocketPayload,
  fallbackEventName: AdminRealtimeEventName,
): AdminRealtimeEvent | null => {
  const eventName = isAdminRealtimeEventName(payload.eventName)
    ? payload.eventName
    : fallbackEventName;
  const data = isRecord(payload.data) ? payload.data : {};

  if (ORDER_EVENT_NAMES.has(eventName)) {
    return mapOrderEvent(eventName, payload, data);
  }

  if (DELIVERY_EVENT_NAMES.has(eventName)) {
    return mapDeliveryEvent(eventName, payload, data);
  }

  if (eventName === ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED) {
    return mapSlaEvent(payload, data);
  }

  return null;
};
