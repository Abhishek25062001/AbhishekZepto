import type {
  AdminDeliveryRealtimeEvent,
  AdminOrderRealtimeEvent,
  AdminSlaRealtimeEvent,
} from '../types/control-tower-realtime.types';

const toTime = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const shouldIgnoreAdminOrderRealtimeEvent = (
  incoming: AdminOrderRealtimeEvent,
  latest: AdminOrderRealtimeEvent | null,
): boolean => {
  if (!latest || incoming.orderId !== latest.orderId) {
    return false;
  }

  const incomingTime = toTime(incoming.updatedAt);
  const latestTime = toTime(latest.updatedAt);
  return incomingTime !== null && latestTime !== null && incomingTime < latestTime;
};

export const shouldIgnoreAdminDeliveryRealtimeEvent = (
  incoming: AdminDeliveryRealtimeEvent,
  latest: AdminDeliveryRealtimeEvent | null,
): boolean => {
  if (!latest || incoming.deliveryId !== latest.deliveryId) {
    return false;
  }

  const incomingTime = toTime(incoming.updatedAt);
  const latestTime = toTime(latest.updatedAt);
  return incomingTime !== null && latestTime !== null && incomingTime < latestTime;
};

export const shouldIgnoreAdminSlaRealtimeEvent = (
  incoming: AdminSlaRealtimeEvent,
  latest: AdminSlaRealtimeEvent | null,
): boolean => {
  if (!latest) {
    return false;
  }

  if (incoming.breachId === latest.breachId) {
    return true;
  }

  const sameBreachTarget =
    incoming.orderId === latest.orderId &&
    incoming.assignmentId === latest.assignmentId &&
    incoming.breachType === latest.breachType;
  if (!sameBreachTarget) {
    return false;
  }

  const incomingTime = toTime(incoming.breachedAt);
  const latestTime = toTime(latest.breachedAt);
  return incomingTime !== null && latestTime !== null && incomingTime <= latestTime;
};
