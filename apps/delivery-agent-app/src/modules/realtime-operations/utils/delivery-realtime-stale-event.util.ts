import type {
  DeliveryAssignmentRealtimeEvent,
  DeliveryStatusRealtimeEvent,
} from '../types/delivery-realtime.types';

export const isDeliveryRealtimeEventStale = (
  incomingUpdatedAt: string | null | undefined,
  latestUpdatedAt: string | null | undefined,
): boolean => {
  if (!incomingUpdatedAt || !latestUpdatedAt) {
    return false;
  }

  return Date.parse(incomingUpdatedAt) < Date.parse(latestUpdatedAt);
};

export const shouldIgnoreAssignmentRealtimeEvent = (
  incomingEvent: DeliveryAssignmentRealtimeEvent,
  latestEvent: DeliveryAssignmentRealtimeEvent | null,
): boolean =>
  Boolean(
    latestEvent &&
      latestEvent.assignmentId === incomingEvent.assignmentId &&
      isDeliveryRealtimeEventStale(incomingEvent.updatedAt, latestEvent.updatedAt),
  );

export const shouldIgnoreStatusRealtimeEvent = (
  incomingEvent: DeliveryStatusRealtimeEvent,
  latestEvent: DeliveryStatusRealtimeEvent | null,
): boolean =>
  Boolean(
    latestEvent &&
      latestEvent.assignmentId === incomingEvent.assignmentId &&
      isDeliveryRealtimeEventStale(incomingEvent.updatedAt, latestEvent.updatedAt),
  );
