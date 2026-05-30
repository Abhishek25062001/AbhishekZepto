import type { DeliveryTrackingRealtimeEventName } from '../constants/delivery-tracking-events.constant';

export type DeliveryTrackingRealtimePayload = {
  orderId: string;
  assignmentId: string;
  deliveryAgentId: string;
  customerId: string;
  storeId: string;
  cityId: string;
  progressStatus: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  lastLocationUpdatedAt: string | null;
  estimatedDeliveryAt: string | null;
  updatedAt: string | null;
};

export type DeliveryLocationRealtimePayload = DeliveryTrackingRealtimePayload & {
  currentLatitude: number;
  currentLongitude: number;
  lastLocationUpdatedAt: string;
};

export type DeliveryProgressRealtimePayload = DeliveryTrackingRealtimePayload;

export type DeliveryTrackingRoomPayload = {
  eventName: DeliveryTrackingRealtimeEventName;
  roomName: string;
  data: DeliveryTrackingRealtimePayload;
};
