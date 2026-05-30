import type {
  AdminDeliveryListItem,
  AdminDeliveryListQuery,
} from '../../../services/api/delivery.api';
import type {
  AdminDeliveryLocation,
  AdminDeliveryRealtimeEvent,
} from '../types/control-tower-realtime.types';

const matchesFilter = (
  delivery: AdminDeliveryListItem,
  filters: AdminDeliveryListQuery,
): boolean => {
  if (filters.status && delivery.deliveryStatus !== filters.status) {
    return false;
  }

  if (filters.cityId && delivery.cityId !== filters.cityId) {
    return false;
  }

  if (filters.agentId && delivery.deliveryAgentId !== filters.agentId) {
    return false;
  }

  if (filters.storeId && delivery.storeId !== filters.storeId) {
    return false;
  }

  return true;
};

const toDeliveryListItem = (
  delivery: AdminDeliveryLocation,
  existingDelivery: AdminDeliveryListItem | undefined,
): AdminDeliveryListItem => {
  const updatedAt = delivery.updatedAt;

  return {
    assignedAt:
      existingDelivery?.assignedAt ??
      (delivery.deliveryStatus === 'assigned' ? updatedAt : null),
    cancelledAt:
      delivery.deliveryStatus === 'cancelled'
        ? updatedAt
        : existingDelivery?.cancelledAt ?? null,
    cityId: delivery.cityId ?? existingDelivery?.cityId ?? '',
    completedAt:
      delivery.deliveryStatus === 'delivered'
        ? updatedAt
        : existingDelivery?.completedAt ?? null,
    createdAt: existingDelivery?.createdAt ?? updatedAt,
    deliveryAgentId: delivery.deliveryAgentId ?? existingDelivery?.deliveryAgentId ?? null,
    deliveryId: delivery.deliveryId,
    deliveryStatus: delivery.deliveryStatus,
    orderId: delivery.orderId,
    pickedUpAt:
      delivery.deliveryStatus === 'picked_up'
        ? updatedAt
        : existingDelivery?.pickedUpAt ?? null,
    storeId: existingDelivery?.storeId ?? '',
  };
};

export const applyAdminRealtimeDeliveryEventToOperationsList = (
  deliveries: AdminDeliveryListItem[],
  event: AdminDeliveryRealtimeEvent | null,
  filters: AdminDeliveryListQuery,
): AdminDeliveryListItem[] => {
  if (!event?.delivery) {
    return deliveries;
  }

  const existingDelivery = deliveries.find(
    (delivery) => delivery.deliveryId === event.delivery?.deliveryId,
  );
  const nextDelivery = toDeliveryListItem(event.delivery, existingDelivery);
  const withoutExistingDelivery = deliveries.filter(
    (delivery) => delivery.deliveryId !== nextDelivery.deliveryId,
  );

  if (!matchesFilter(nextDelivery, filters)) {
    return withoutExistingDelivery;
  }

  return [nextDelivery, ...withoutExistingDelivery];
};
