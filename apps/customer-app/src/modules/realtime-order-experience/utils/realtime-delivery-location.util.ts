import { CUSTOMER_REALTIME_EVENTS } from '../types/realtime-order.types';
import type {
  CustomerRealtimeEventName,
  DeliveryTrackingRealtimeEvent,
  RealtimeSocketPayload,
} from '../types/realtime-order.types';

const DELIVERY_TRACKING_EVENTS = new Set<CustomerRealtimeEventName>([
  CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  CUSTOMER_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED,
  CUSTOMER_REALTIME_EVENTS.RIDER_REACHED_CUSTOMER,
  CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
  CUSTOMER_REALTIME_EVENTS.DELIVERY_FAILED,
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

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

export const hasValidRealtimeCoordinates = (
  latitude: number | null,
  longitude: number | null,
): boolean =>
  typeof latitude === 'number' &&
  Number.isFinite(latitude) &&
  latitude >= -90 &&
  latitude <= 90 &&
  typeof longitude === 'number' &&
  Number.isFinite(longitude) &&
  longitude >= -180 &&
  longitude <= 180;

export const isLocationEventStale = (
  incomingLastLocationUpdatedAt: string | null,
  latestLastLocationUpdatedAt: string | null,
): boolean => {
  if (!incomingLastLocationUpdatedAt || !latestLastLocationUpdatedAt) {
    return false;
  }

  return (
    Date.parse(incomingLastLocationUpdatedAt) <
    Date.parse(latestLastLocationUpdatedAt)
  );
};

export const mapRealtimeDeliveryTrackingPayload = (
  payload: RealtimeSocketPayload,
  fallbackEventName: CustomerRealtimeEventName,
): DeliveryTrackingRealtimeEvent | null => {
  const eventName =
    typeof payload.eventName === 'string' &&
    DELIVERY_TRACKING_EVENTS.has(payload.eventName as CustomerRealtimeEventName)
      ? (payload.eventName as CustomerRealtimeEventName)
      : fallbackEventName;
  if (!DELIVERY_TRACKING_EVENTS.has(eventName)) {
    return null;
  }

  const data = isRecord(payload.data) ? payload.data : {};
  const orderId = toStringValue(data.orderId);
  const assignmentId = toStringValue(data.assignmentId);
  const deliveryAgentId = toStringValue(data.deliveryAgentId);
  const currentLatitude = toNumberValue(data.currentLatitude);
  const currentLongitude = toNumberValue(data.currentLongitude);
  const lastLocationUpdatedAt = normalizeTimestamp(data.lastLocationUpdatedAt);

  if (!orderId || !assignmentId || !deliveryAgentId) {
    return null;
  }

  if (
    eventName === CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED &&
    !hasValidRealtimeCoordinates(currentLatitude, currentLongitude)
  ) {
    return null;
  }

  return {
    eventName,
    orderId,
    assignmentId,
    deliveryAgentId,
    customerId: toStringValue(data.customerId) ?? '',
    storeId: toStringValue(data.storeId) ?? '',
    cityId: toStringValue(data.cityId) ?? '',
    progressStatus: toStringValue(data.progressStatus) ?? '',
    currentLatitude,
    currentLongitude,
    lastLocationUpdatedAt,
    estimatedDeliveryAt: normalizeTimestamp(data.estimatedDeliveryAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
    eventId: toStringValue(data.eventId),
    emittedAt: normalizeTimestamp(payload.emittedAt),
  };
};
