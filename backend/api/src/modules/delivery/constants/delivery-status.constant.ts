import type { DeliveryStatus } from '../types/delivery-assignment.types';

/** All allowed delivery statuses. */
export const DELIVERY_STATUS: Record<Uppercase<DeliveryStatus>, DeliveryStatus> = Object.freeze({
  PENDING_ASSIGNMENT: 'pending_assignment',
  ASSIGNED: 'assigned',
  EN_ROUTE_TO_STORE: 'en_route_to_store',
  ARRIVED_AT_STORE: 'arrived_at_store',
  PICKED_UP: 'picked_up',
  EN_ROUTE_TO_CUSTOMER: 'en_route_to_customer',
  ARRIVED_AT_CUSTOMER: 'arrived_at_customer',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

export const DELIVERY_STATUS_VALUES = Object.values(DELIVERY_STATUS) as [
  DeliveryStatus,
  ...DeliveryStatus[],
];

/** MongoDB collection name for delivery assignments. */
export const DELIVERY_ASSIGNMENT_COLLECTION = 'deliveries' as const;
