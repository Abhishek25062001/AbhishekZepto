import { DELIVERY_STATUS_VALUES } from '../../delivery/constants/delivery-status.constant';
import type { DeliveryTrackingRealtimeEventName } from '../constants/delivery-tracking-events.constant';
import { DELIVERY_TRACKING_REALTIME_EVENTS } from '../constants/delivery-tracking-events.constant';
import type { DeliveryTrackingRealtimePayload } from '../types/delivery-tracking-realtime.types';

const BLOCKED_PAYLOAD_FIELDS = [
  'otp',
  'otpCode',
  'otpHash',
  'pickupOtp',
  'deliveryOtp',
  'verificationValue',
] as const;

const hasBlockedField = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return Object.keys(record).some((key) => BLOCKED_PAYLOAD_FIELDS.includes(
    key as (typeof BLOCKED_PAYLOAD_FIELDS)[number],
  ));
};

const isLocationEvent = (eventName: DeliveryTrackingRealtimeEventName): boolean =>
  eventName === DELIVERY_TRACKING_REALTIME_EVENTS.CUSTOMER_DELIVERY_LOCATION_UPDATED ||
  eventName === DELIVERY_TRACKING_REALTIME_EVENTS.ADMIN_DELIVERY_LOCATION_UPDATED ||
  eventName === DELIVERY_TRACKING_REALTIME_EVENTS.DELIVERY_LOCATION_SYNC_ACKNOWLEDGED;

const hasValidCoordinates = (payload: DeliveryTrackingRealtimePayload): boolean => {
  return (
    typeof payload.currentLatitude === 'number' &&
    Number.isFinite(payload.currentLatitude) &&
    payload.currentLatitude >= -90 &&
    payload.currentLatitude <= 90 &&
    typeof payload.currentLongitude === 'number' &&
    Number.isFinite(payload.currentLongitude) &&
    payload.currentLongitude >= -180 &&
    payload.currentLongitude <= 180
  );
};

export const validateDeliveryTrackingRealtimePayload = (
  eventName: DeliveryTrackingRealtimeEventName,
  payload: DeliveryTrackingRealtimePayload,
): void => {
  if (!payload.orderId) {
    throw new Error('Delivery tracking realtime payload requires orderId');
  }

  if (!payload.assignmentId) {
    throw new Error('Delivery tracking realtime payload requires assignmentId');
  }

  if (!payload.deliveryAgentId) {
    throw new Error('Delivery tracking realtime payload requires deliveryAgentId');
  }

  if (!DELIVERY_STATUS_VALUES.includes(payload.progressStatus as never)) {
    throw new Error('Delivery tracking realtime payload contains invalid progressStatus');
  }

  if (isLocationEvent(eventName) && !hasValidCoordinates(payload)) {
    throw new Error('Delivery tracking realtime payload requires valid coordinates');
  }

  if (hasBlockedField(payload)) {
    throw new Error('Delivery tracking realtime payload contains blocked fields');
  }
};

export const hasValidDeliveryTrackingCoordinates = hasValidCoordinates;
