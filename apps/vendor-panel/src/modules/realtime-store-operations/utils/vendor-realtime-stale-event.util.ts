import type {
  VendorOrderRealtimeEvent,
  VendorPickupRealtimeEvent,
} from '../types/vendor-realtime.types';

export const isVendorRealtimeEventStale = (
  incomingUpdatedAt: string | null | undefined,
  latestUpdatedAt: string | null | undefined,
): boolean => {
  if (!incomingUpdatedAt || !latestUpdatedAt) {
    return false;
  }

  return Date.parse(incomingUpdatedAt) < Date.parse(latestUpdatedAt);
};

export const shouldIgnoreVendorOrderRealtimeEvent = (
  incomingEvent: VendorOrderRealtimeEvent,
  latestEvent: VendorOrderRealtimeEvent | null,
): boolean =>
  Boolean(
    latestEvent &&
      latestEvent.orderId === incomingEvent.orderId &&
      isVendorRealtimeEventStale(incomingEvent.updatedAt, latestEvent.updatedAt),
  );

export const shouldIgnoreVendorPickupRealtimeEvent = (
  incomingEvent: VendorPickupRealtimeEvent,
  latestEvent: VendorPickupRealtimeEvent | null,
): boolean =>
  Boolean(
    latestEvent &&
      latestEvent.orderId === incomingEvent.orderId &&
      isVendorRealtimeEventStale(incomingEvent.updatedAt, latestEvent.updatedAt),
  );

