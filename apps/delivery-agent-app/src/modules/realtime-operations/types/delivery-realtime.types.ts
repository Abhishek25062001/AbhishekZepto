import type {
  DeliveryAssignmentResponse,
  DeliveryStatus,
} from '../../../types/delivery.types';

export const DELIVERY_REALTIME_EVENTS = {
  ASSIGNMENT_CREATED: 'delivery.assignment_created',
  ASSIGNMENT_CANCELLED: 'delivery.assignment_cancelled',
  PICKUP_UPDATED: 'delivery.pickup_updated',
  DELIVERY_STATUS_UPDATED: 'delivery.delivery_status_updated',
  LOCATION_SYNC_ACKNOWLEDGED: 'delivery.location_sync_acknowledged',
  LOCATION_SYNC_REJECTED: 'delivery.location_sync_rejected',
} as const;

export type DeliveryRealtimeEventName =
  (typeof DELIVERY_REALTIME_EVENTS)[keyof typeof DELIVERY_REALTIME_EVENTS];

export type DeliverySocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'failed';

export type DeliveryRealtimeSocketPayload<TData = unknown> = {
  eventName?: DeliveryRealtimeEventName;
  roomName?: string;
  emittedAt?: string;
  data?: TData;
};

export type DeliveryAssignmentRealtimeEvent = {
  eventName:
    | typeof DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED
    | typeof DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED;
  assignmentId: string;
  orderId: string;
  deliveryStatus: DeliveryStatus;
  assignmentCode?: string | null;
  pickupEta?: string | null;
  updatedAt: string;
  emittedAt?: string | null;
  eventId?: string | null;
  assignment?: DeliveryAssignmentResponse | null;
};

export type DeliveryStatusRealtimeEvent = {
  eventName:
    | typeof DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED
    | typeof DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED
    | typeof DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED
    | typeof DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED;
  assignmentId: string;
  orderId: string;
  deliveryStatus: DeliveryStatus;
  updatedAt: string;
  emittedAt?: string | null;
  eventId?: string | null;
  rejectionReason?: string | null;
};

export type DeliveryRealtimeEvent =
  | DeliveryAssignmentRealtimeEvent
  | DeliveryStatusRealtimeEvent;
