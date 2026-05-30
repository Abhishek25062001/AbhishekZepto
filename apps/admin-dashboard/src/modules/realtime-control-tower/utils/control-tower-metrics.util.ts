import {
  ADMIN_REALTIME_EVENTS,
  type AdminControlTowerMetricSnapshot,
  type AdminDeliveryRealtimeEvent,
  type AdminOrderRealtimeEvent,
  type AdminSlaRealtimeEvent,
} from '../types/control-tower-realtime.types';

export const EMPTY_CONTROL_TOWER_METRICS: AdminControlTowerMetricSnapshot = {
  activeOrdersCount: 0,
  assignedRidersCount: 0,
  outForDeliveryCount: 0,
  delayedOrdersCount: 0,
  openSlaBreachesCount: 0,
};

export const applyAdminRealtimeEventsToMetrics = (
  metrics: AdminControlTowerMetricSnapshot,
  orderEvent: AdminOrderRealtimeEvent | null,
  deliveryEvent: AdminDeliveryRealtimeEvent | null,
  slaEvent: AdminSlaRealtimeEvent | null,
): AdminControlTowerMetricSnapshot => {
  const next = { ...metrics };

  if (orderEvent?.eventName === ADMIN_REALTIME_EVENTS.ORDER_CREATED) {
    next.activeOrdersCount += 1;
  }

  if (orderEvent?.eventName === ADMIN_REALTIME_EVENTS.ORDER_DELAYED) {
    next.delayedOrdersCount += 1;
  }

  if (
    orderEvent?.eventName === ADMIN_REALTIME_EVENTS.ORDER_CANCELLED &&
    next.activeOrdersCount > 0
  ) {
    next.activeOrdersCount -= 1;
  }

  if (deliveryEvent?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED) {
    next.assignedRidersCount += 1;
  }

  if (
    deliveryEvent &&
    ['en_route_to_customer', 'arrived_at_customer'].includes(
      deliveryEvent.deliveryStatus,
    )
  ) {
    next.outForDeliveryCount += 1;
  }

  if (slaEvent?.eventName === ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED) {
    next.openSlaBreachesCount += 1;
  }

  return next;
};
