import type { DeliveryTrackingRealtimePayload } from '../types/delivery-tracking-realtime.types';

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

const toNumberValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const read = (source: SourceRecord, primaryKey: string, fallbackKey?: string): unknown => {
  return source[primaryKey] ?? (fallbackKey ? source[fallbackKey] : undefined);
};

export const mapDeliveryTrackingRealtimePayload = (
  progress: unknown,
): DeliveryTrackingRealtimePayload => {
  const source = toSourceRecord(progress);

  return {
    orderId: toStringValue(source.orderId) ?? '',
    assignmentId: toStringValue(read(source, 'assignmentId', '_id')) ?? '',
    deliveryAgentId: toStringValue(source.deliveryAgentId) ?? '',
    customerId: toStringValue(source.customerId) ?? '',
    storeId: toStringValue(source.storeId) ?? '',
    cityId: toStringValue(source.cityId) ?? '',
    progressStatus: toStringValue(read(source, 'progressStatus', 'deliveryStatus')) ?? '',
    currentLatitude: toNumberValue(source.currentLatitude),
    currentLongitude: toNumberValue(source.currentLongitude),
    lastLocationUpdatedAt: toIsoString(
      read(source, 'lastLocationUpdatedAt', 'updatedAt'),
    ),
    estimatedDeliveryAt: toIsoString(source.estimatedDeliveryAt),
    updatedAt: toIsoString(source.updatedAt),
  };
};
