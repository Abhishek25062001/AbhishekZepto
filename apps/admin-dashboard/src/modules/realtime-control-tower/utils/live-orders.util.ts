import type {
  AdminLiveOrder,
  AdminOrderRealtimeEvent,
} from '../types/control-tower-realtime.types';

export const applyAdminRealtimeOrderEventToList = (
  orders: AdminLiveOrder[],
  event: AdminOrderRealtimeEvent | null,
  shouldIncludeOrder: (order: AdminLiveOrder) => boolean = () => true,
): AdminLiveOrder[] => {
  if (!event?.order) {
    return orders;
  }

  const withoutExistingOrder = orders.filter(
    (order) => order.orderId !== event.order?.orderId,
  );

  if (!shouldIncludeOrder(event.order)) {
    return withoutExistingOrder;
  }

  return [event.order, ...withoutExistingOrder];
};
