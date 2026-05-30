import { useVendorRealtimeStore } from '../store/vendor-realtime.store';
import {
  VENDOR_REALTIME_EVENTS,
  type VendorOrderRealtimeEvent,
  type VendorPickupRealtimeEvent,
  type VendorRealtimeEventName,
  type VendorRealtimeSocketPayload,
} from '../types/vendor-realtime.types';
import { mapVendorRealtimeEventPayload } from './vendor-realtime-event.mapper';
import {
  shouldIgnoreVendorOrderRealtimeEvent,
  shouldIgnoreVendorPickupRealtimeEvent,
} from './vendor-realtime-stale-event.util';

const isOrderRealtimeEvent = (
  event: ReturnType<typeof mapVendorRealtimeEventPayload>,
): event is VendorOrderRealtimeEvent =>
  event?.eventName === VENDOR_REALTIME_EVENTS.ORDER_CREATED ||
  event?.eventName === VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED ||
  event?.eventName === VENDOR_REALTIME_EVENTS.ORDER_CANCELLED;

const isPickupRealtimeEvent = (
  event: ReturnType<typeof mapVendorRealtimeEventPayload>,
): event is VendorPickupRealtimeEvent =>
  Boolean(event) && !isOrderRealtimeEvent(event);

export const handleVendorRealtimePayload = (
  payload: VendorRealtimeSocketPayload,
  eventName: VendorRealtimeEventName,
): void => {
  const event = mapVendorRealtimeEventPayload(payload, eventName);
  if (!event) {
    return;
  }

  if (isOrderRealtimeEvent(event)) {
    if (
      shouldIgnoreVendorOrderRealtimeEvent(
        event,
        useVendorRealtimeStore.getState().lastOrderEvent,
      )
    ) {
      return;
    }

    useVendorRealtimeStore.getState().setLastOrderEvent(event);
    return;
  }

  if (isPickupRealtimeEvent(event)) {
    if (
      shouldIgnoreVendorPickupRealtimeEvent(
        event,
        useVendorRealtimeStore.getState().lastPickupEvent,
      )
    ) {
      return;
    }

    useVendorRealtimeStore.getState().setLastPickupEvent(event);
  }
};
