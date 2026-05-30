import {
  VENDOR_REALTIME_EVENTS,
  type VendorPickupRealtimeEvent,
} from '../types/vendor-realtime.types';

export type VendorRealtimePickupDeliveryStatus =
  | 'arrived_at_store'
  | 'picked_up';

export const getVendorRealtimePickupStatusForOrder = (
  event: VendorPickupRealtimeEvent | null,
  orderId: string,
): VendorRealtimePickupDeliveryStatus | null => {
  if (!event || event.orderId !== orderId) {
    return null;
  }

  if (event.eventName === VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED) {
    return 'picked_up';
  }

  if (event.eventName === VENDOR_REALTIME_EVENTS.RIDER_ARRIVED) {
    return 'arrived_at_store';
  }

  return null;
};
