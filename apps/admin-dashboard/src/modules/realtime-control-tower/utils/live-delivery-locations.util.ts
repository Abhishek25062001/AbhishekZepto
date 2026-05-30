import type {
  AdminDeliveryLocation,
  AdminDeliveryRealtimeEvent,
} from '../types/control-tower-realtime.types';

export const applyAdminRealtimeDeliveryEventToLocations = (
  deliveries: AdminDeliveryLocation[],
  event: AdminDeliveryRealtimeEvent | null,
): AdminDeliveryLocation[] => {
  if (!event?.delivery) {
    return deliveries;
  }

  const withoutExistingDelivery = deliveries.filter(
    (delivery) => delivery.deliveryId !== event.delivery?.deliveryId,
  );
  return [event.delivery, ...withoutExistingDelivery];
};
