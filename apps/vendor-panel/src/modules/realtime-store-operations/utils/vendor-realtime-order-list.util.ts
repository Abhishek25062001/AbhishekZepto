import type {
  VendorOrderDetail,
  VendorOrderListItem,
} from '../../orders/types/vendor-orders.types';
import type { VendorOrderRealtimeEvent } from '../types/vendor-realtime.types';

export const applyVendorRealtimeOrderEventToList = (
  orders: VendorOrderListItem[],
  event: VendorOrderRealtimeEvent | null,
  shouldIncludeOrder: (order: VendorOrderListItem) => boolean,
): VendorOrderListItem[] => {
  if (!event?.order) {
    return orders;
  }

  const nextOrder = event.order;
  const withoutExistingOrder = orders.filter(
    (order) => order.orderId !== nextOrder.orderId,
  );

  if (!shouldIncludeOrder(nextOrder)) {
    return withoutExistingOrder;
  }

  return [nextOrder, ...withoutExistingOrder];
};

export const applyVendorRealtimeOrderEventToDetail = (
  order: VendorOrderDetail,
  event: VendorOrderRealtimeEvent | null,
): VendorOrderDetail => {
  if (!event?.order || event.orderId !== order.orderId) {
    return order;
  }

  return {
    ...order,
    acceptedAt: event.order.acceptedAt,
    createdAt: event.order.createdAt,
    grandTotal: event.order.grandTotal,
    itemCount: event.order.itemCount,
    orderStatus: event.order.orderStatus,
    packingStatus: event.order.packingStatus,
    pickerStatus: event.order.pickerStatus,
    placedAt: event.order.placedAt,
    slaBreachedStage: event.order.slaBreachedStage,
    slaStatus: event.order.slaStatus,
    storeStatus: event.order.storeStatus,
    updatedAt: event.updatedAt,
  };
};
