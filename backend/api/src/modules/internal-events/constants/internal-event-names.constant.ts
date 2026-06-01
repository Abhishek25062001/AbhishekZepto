export const INTERNAL_EVENT_NAMES = {
  ORDER_CREATED: 'order.created',
  ORDER_ACCEPTED: 'order.accepted',
  ORDER_PACKED: 'order.packed',
  ORDER_READY_FOR_PICKUP: 'order.ready_for_pickup',
  ORDER_OUT_FOR_DELIVERY: 'order.out_for_delivery',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_DELIVERED: 'order.delivered',

  DELIVERY_ASSIGNMENT_CREATED: 'delivery.assignment_created',
  DELIVERY_ASSIGNMENT_ACCEPTED: 'delivery.assignment_accepted',
  DELIVERY_PICKUP_COMPLETED: 'delivery.pickup_completed',
  DELIVERY_OUT_FOR_DELIVERY: 'delivery.out_for_delivery',
  DELIVERY_LOCATION_UPDATED: 'delivery.location_updated',
  DELIVERY_REACHED_CUSTOMER: 'delivery.reached_customer',
  DELIVERY_COMPLETED: 'delivery.completed',
  DELIVERY_FAILED: 'delivery.failed',

  DELIVERY_SLA_BREACH_CREATED: 'delivery.sla_breach_created',

  ADMIN_ORDER_FORCE_CANCELLED: 'admin.order_force_cancelled',
  ADMIN_FORCE_ASSIGNMENT_CREATED: 'admin.force_assignment_created',
} as const;

export const INTERNAL_EVENT_NAME_VALUES = Object.values(INTERNAL_EVENT_NAMES);

export type InternalEventName =
  (typeof INTERNAL_EVENT_NAMES)[keyof typeof INTERNAL_EVENT_NAMES];
