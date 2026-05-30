import type { DeliveryStatus } from '../../../types/delivery.types';
import {
  DELIVERY_REALTIME_EVENTS,
  type DeliveryAssignmentRealtimeEvent,
  type DeliveryRealtimeEvent,
  type DeliveryRealtimeEventName,
  type DeliveryRealtimeSocketPayload,
  type DeliveryStatusRealtimeEvent,
} from '../types/delivery-realtime.types';

const DELIVERY_STATUSES = new Set<DeliveryStatus>([
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

const ASSIGNMENT_EVENT_NAMES = new Set<DeliveryRealtimeEventName>([
  DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
  DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
]);

const STATUS_EVENT_NAMES = new Set<DeliveryRealtimeEventName>([
  DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
  DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
  DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
  DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toStringValue = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const normalizeTimestamp = (value: unknown): string | null => {
  const timestamp = toStringValue(value);
  if (!timestamp) {
    return null;
  }

  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
};

const isDeliveryRealtimeEventName = (
  value: unknown,
): value is DeliveryRealtimeEventName =>
  typeof value === 'string' &&
  Object.values(DELIVERY_REALTIME_EVENTS).includes(
    value as DeliveryRealtimeEventName,
  );

const normalizeDeliveryStatus = (
  eventName: DeliveryRealtimeEventName,
  data: Record<string, unknown>,
): DeliveryStatus | null => {
  const rawStatus =
    toStringValue(data.deliveryStatus) ??
    toStringValue(data.pickupStatus) ??
    toStringValue(data.progressStatus) ??
    toStringValue(data.assignmentStatus) ??
    toStringValue(data.status);

  if (rawStatus && DELIVERY_STATUSES.has(rawStatus as DeliveryStatus)) {
    return rawStatus as DeliveryStatus;
  }

  if (eventName === DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED) {
    return 'cancelled';
  }

  return null;
};

const getUpdatedAt = (
  payload: DeliveryRealtimeSocketPayload,
  data: Record<string, unknown>,
): string | null =>
  normalizeTimestamp(data.updatedAt) ??
  normalizeTimestamp(data.lastLocationUpdatedAt) ??
  normalizeTimestamp(data.pickedUpAt) ??
  normalizeTimestamp(data.arrivedAtStoreAt) ??
  normalizeTimestamp(payload.emittedAt);

export const mapDeliveryRealtimeEventPayload = (
  payload: DeliveryRealtimeSocketPayload,
  fallbackEventName: DeliveryRealtimeEventName,
): DeliveryRealtimeEvent | null => {
  const eventName = isDeliveryRealtimeEventName(payload.eventName)
    ? payload.eventName
    : fallbackEventName;
  const data = isRecord(payload.data) ? payload.data : {};
  const assignmentId =
    toStringValue(data.assignmentId) ?? toStringValue(data.deliveryId);
  const orderId = toStringValue(data.orderId);
  const deliveryStatus = normalizeDeliveryStatus(eventName, data);
  const updatedAt = getUpdatedAt(payload, data);

  if (!assignmentId || !orderId || !deliveryStatus || !updatedAt) {
    return null;
  }

  if (ASSIGNMENT_EVENT_NAMES.has(eventName)) {
    const assignmentEvent: DeliveryAssignmentRealtimeEvent = {
      eventName:
        eventName as DeliveryAssignmentRealtimeEvent['eventName'],
      assignmentId,
      orderId,
      deliveryStatus,
      assignmentCode: toStringValue(data.assignmentCode),
      pickupEta:
        normalizeTimestamp(data.pickupEta) ??
        normalizeTimestamp(data.estimatedPickupAt),
      updatedAt,
      emittedAt: normalizeTimestamp(payload.emittedAt),
      eventId: toStringValue(data.eventId),
      assignment: null,
    };
    return assignmentEvent;
  }

  if (STATUS_EVENT_NAMES.has(eventName)) {
    const statusEvent: DeliveryStatusRealtimeEvent = {
      eventName: eventName as DeliveryStatusRealtimeEvent['eventName'],
      assignmentId,
      orderId,
      deliveryStatus,
      updatedAt,
      emittedAt: normalizeTimestamp(payload.emittedAt),
      eventId: toStringValue(data.eventId),
      rejectionReason:
        toStringValue(data.rejectionReason) ?? toStringValue(data.failureReason),
    };
    return statusEvent;
  }

  return null;
};
