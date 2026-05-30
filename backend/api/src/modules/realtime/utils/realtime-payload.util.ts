import type { Types } from 'mongoose';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';

type PlainObject = Record<string, unknown>;

const blockedFieldNames = new Set([
  '__v',
  'otp',
  'otpCode',
  'otpHash',
  'pickupOtp',
  'deliveryOtp',
  'verificationValue',
  'authToken',
  'accessToken',
  'refreshToken',
  'fcmToken',
  'internalMetadata',
]);

const isPlainObject = (value: unknown): value is PlainObject => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
};

const toStringId = (value: Types.ObjectId | string | null | undefined): string | null => {
  return value ? value.toString() : null;
};

export const sanitizeRealtimePayload = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeRealtimePayload(item)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const sanitized: PlainObject = {};

  Object.entries(value).forEach(([key, item]) => {
    if (blockedFieldNames.has(key)) {
      return;
    }

    sanitized[key] = sanitizeRealtimePayload(item);
  });

  return sanitized as T;
};

export const mapAssignmentRealtimePayload = (
  delivery: IDeliveryAssignmentDocument,
): PlainObject => {
  return sanitizeRealtimePayload({
    assignmentId: delivery._id.toString(),
    orderId: delivery.orderId.toString(),
    customerId: delivery.customerId.toString(),
    storeId: delivery.storeId.toString(),
    cityId: delivery.cityId.toString(),
    deliveryAgentId: toStringId(delivery.deliveryAgentId),
    deliveryStatus: delivery.deliveryStatus,
    assignedAt: delivery.assignedAt?.toISOString() ?? null,
    updatedAt: delivery.updatedAt?.toISOString() ?? null,
  });
};

export const mapPickupRealtimePayload = (
  delivery: IDeliveryAssignmentDocument,
): PlainObject => {
  return sanitizeRealtimePayload({
    assignmentId: delivery._id.toString(),
    orderId: delivery.orderId.toString(),
    storeId: delivery.storeId.toString(),
    deliveryAgentId: toStringId(delivery.deliveryAgentId),
    pickupStatus: delivery.deliveryStatus,
    arrivedAtStoreAt: delivery.arrivedAtStoreAt?.toISOString() ?? null,
    pickedUpAt: delivery.pickedUpAt?.toISOString() ?? null,
  });
};

export const mapDeliveryProgressRealtimePayload = (
  delivery: IDeliveryAssignmentDocument,
): PlainObject => {
  return sanitizeRealtimePayload({
    assignmentId: delivery._id.toString(),
    orderId: delivery.orderId.toString(),
    customerId: delivery.customerId.toString(),
    deliveryAgentId: toStringId(delivery.deliveryAgentId),
    deliveryStatus: delivery.deliveryStatus,
    enRouteToCustomerAt: delivery.enRouteToCustomerAt?.toISOString() ?? null,
    arrivedAtCustomerAt: delivery.arrivedAtCustomerAt?.toISOString() ?? null,
    deliveredAt: delivery.deliveredAt?.toISOString() ?? null,
    failedAt: delivery.failedAt?.toISOString() ?? null,
    updatedAt: delivery.updatedAt?.toISOString() ?? null,
  });
};

export const mapSlaBreachRealtimePayload = (
  delivery: IDeliveryAssignmentDocument,
): PlainObject => {
  return sanitizeRealtimePayload({
    assignmentId: delivery._id.toString(),
    orderId: delivery.orderId.toString(),
    storeId: delivery.storeId.toString(),
    cityId: delivery.cityId.toString(),
    slaStatus: delivery.slaStatus,
    slaBreachedStage: delivery.slaBreachedStage,
    slaBreachedAt: delivery.slaBreachedAt?.toISOString() ?? null,
  });
};
