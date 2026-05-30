import {
  VENDOR_REALTIME_EVENTS,
  type VendorOrderRealtimeEvent,
  type VendorPickupRealtimeEvent,
} from '../types/vendor-realtime.types';

export type NewOrderRealtimeAlertViewModel = {
  orderId: string;
  totalAmountLabel: string;
  itemCountLabel: string;
  createdTimeLabel: string;
  targetPath: string;
};

export type RiderArrivedAlertViewModel = {
  orderId: string;
  assignmentId: string;
  riderId: string;
  arrivedTimeLabel: string;
  targetPath: string;
};

const formatTime = (timestamp: string | null): string =>
  timestamp ? new Date(timestamp).toLocaleTimeString() : 'Time pending';

export const getNewOrderRealtimeAlertViewModel = (
  event: VendorOrderRealtimeEvent | null,
): NewOrderRealtimeAlertViewModel | null => {
  if (!event || event.eventName !== VENDOR_REALTIME_EVENTS.ORDER_CREATED) {
    return null;
  }

  return {
    orderId: event.orderId,
    totalAmountLabel: `₹${event.totalAmount.toFixed(2)}`,
    itemCountLabel: `${event.itemCount} items`,
    createdTimeLabel: formatTime(event.updatedAt),
    targetPath: `/orders/${event.orderId}`,
  };
};

export const getRiderArrivedAlertViewModel = (
  event: VendorPickupRealtimeEvent | null,
): RiderArrivedAlertViewModel | null => {
  if (!event || event.eventName !== VENDOR_REALTIME_EVENTS.RIDER_ARRIVED) {
    return null;
  }

  return {
    orderId: event.orderId,
    assignmentId: event.assignmentId,
    riderId: event.riderId,
    arrivedTimeLabel: event.arrivedAt
      ? formatTime(event.arrivedAt)
      : 'Arrival time pending',
    targetPath: `/orders/active/${event.orderId}`,
  };
};

