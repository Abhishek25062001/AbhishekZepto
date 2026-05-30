import type { InternalEventPayload } from '../types/internal-event.types';

type SourceRecord = Record<string, unknown>;

const toSourceRecord = (source: unknown): SourceRecord => {
  if (!source || typeof source !== 'object') {
    return {};
  }

  return source as SourceRecord;
};

const toStringValue = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (
    typeof value === 'object' &&
    'toString' in value &&
    typeof value.toString === 'function'
  ) {
    return value.toString();
  }

  return null;
};

const toIsoString = (value: unknown): string | null => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  return null;
};

const read = (source: SourceRecord, primaryKey: string, fallbackKey?: string): unknown => {
  return source[primaryKey] ?? (fallbackKey ? source[fallbackKey] : undefined);
};

export const mapAssignmentInternalEventPayload = (assignment: unknown): InternalEventPayload => {
  const source = toSourceRecord(assignment);

  return {
    orderId: toStringValue(source.orderId),
    assignmentId: toStringValue(read(source, 'assignmentId', '_id')),
    customerId: toStringValue(source.customerId),
    deliveryAgentId: toStringValue(source.deliveryAgentId),
    storeId: toStringValue(source.storeId),
    cityId: toStringValue(source.cityId),
    assignmentStatus: toStringValue(read(source, 'assignmentStatus', 'deliveryStatus')),
  };
};

export const mapPickupInternalEventPayload = (pickup: unknown): InternalEventPayload => {
  const source = toSourceRecord(pickup);

  return {
    orderId: toStringValue(source.orderId),
    assignmentId: toStringValue(read(source, 'assignmentId', '_id')),
    customerId: toStringValue(source.customerId),
    deliveryAgentId: toStringValue(source.deliveryAgentId),
    storeId: toStringValue(source.storeId),
    pickupStatus: toStringValue(read(source, 'pickupStatus', 'deliveryStatus')),
  };
};

export const mapProgressInternalEventPayload = (progress: unknown): InternalEventPayload => {
  const source = toSourceRecord(progress);

  return {
    orderId: toStringValue(source.orderId),
    assignmentId: toStringValue(read(source, 'assignmentId', '_id')),
    customerId: toStringValue(source.customerId),
    deliveryAgentId: toStringValue(source.deliveryAgentId),
    storeId: toStringValue(source.storeId),
    cityId: toStringValue(source.cityId),
    progressStatus: toStringValue(read(source, 'progressStatus', 'deliveryStatus')),
    currentLatitude: source.currentLatitude ?? null,
    currentLongitude: source.currentLongitude ?? null,
    lastLocationUpdatedAt: toIsoString(read(source, 'lastLocationUpdatedAt', 'updatedAt')),
    estimatedDeliveryAt: toIsoString(source.estimatedDeliveryAt),
    updatedAt: toIsoString(source.updatedAt),
  };
};

export const mapCompletionInternalEventPayload = (completion: unknown): InternalEventPayload => {
  const source = toSourceRecord(completion);

  return {
    orderId: toStringValue(source.orderId),
    assignmentId: toStringValue(read(source, 'assignmentId', '_id')),
    customerId: toStringValue(source.customerId),
    deliveryAgentId: toStringValue(source.deliveryAgentId),
    storeId: toStringValue(source.storeId),
    cityId: toStringValue(source.cityId),
    completionStatus: toStringValue(read(source, 'completionStatus', 'deliveryStatus')),
    progressStatus: toStringValue(read(source, 'progressStatus', 'deliveryStatus')),
    currentLatitude: source.currentLatitude ?? null,
    currentLongitude: source.currentLongitude ?? null,
    lastLocationUpdatedAt: toIsoString(read(source, 'lastLocationUpdatedAt', 'updatedAt')),
    estimatedDeliveryAt: toIsoString(source.estimatedDeliveryAt),
    completedAt: toIsoString(read(source, 'completedAt', 'deliveredAt')),
    updatedAt: toIsoString(source.updatedAt),
  };
};

export const mapSlaInternalEventPayload = (breach: unknown): InternalEventPayload => {
  const source = toSourceRecord(breach);

  return {
    breachId: toStringValue(read(source, 'breachId', '_id')),
    orderId: toStringValue(source.orderId),
    assignmentId: toStringValue(read(source, 'assignmentId', '_id')),
    customerId: toStringValue(source.customerId),
    deliveryAgentId: toStringValue(source.deliveryAgentId),
    storeId: toStringValue(source.storeId),
    cityId: toStringValue(source.cityId),
    slaType: toStringValue(read(source, 'slaType', 'slaBreachedStage')),
    breachStatus: toStringValue(read(source, 'breachStatus', 'slaStatus')),
    escalationLevel: toStringValue(source.escalationLevel),
  };
};

export const mapOrderInternalEventPayload = (order: unknown): InternalEventPayload => {
  const source = toSourceRecord(order);

  return {
    orderId: toStringValue(read(source, 'orderId', '_id')),
    orderNumber: toStringValue(source.orderNumber),
    customerId: toStringValue(source.customerId),
    storeId: toStringValue(source.storeId),
    vendorId: toStringValue(source.vendorId),
    cityId: toStringValue(source.cityId),
    orderStatus: toStringValue(source.orderStatus),
    paymentStatus: toStringValue(source.paymentStatus),
    totalAmount: source.totalAmount ?? source.grandTotal ?? null,
    updatedAt: toIsoString(source.updatedAt),
  };
};
