import type { OrderRealtimePayload } from '../types/order-realtime.types';

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

  return null;
};

const read = (source: SourceRecord, primaryKey: string, fallbackKey?: string): unknown => {
  return source[primaryKey] ?? (fallbackKey ? source[fallbackKey] : undefined);
};

export const mapOrderRealtimePayload = (
  order: unknown,
  eventSource: OrderRealtimePayload['eventSource'] = 'order',
): OrderRealtimePayload => {
  const source = toSourceRecord(order);

  return {
    orderId: toStringValue(read(source, 'orderId', '_id')) ?? '',
    customerId: toStringValue(source.customerId) ?? '',
    storeId: toStringValue(source.storeId) ?? '',
    vendorId: toStringValue(source.vendorId),
    cityId: toStringValue(source.cityId),
    orderStatus: toStringValue(source.orderStatus) ?? '',
    paymentStatus: toStringValue(source.paymentStatus),
    totalAmount: toNumberValue(read(source, 'totalAmount', 'grandTotal')),
    updatedAt: toIsoString(source.updatedAt),
    eventSource,
  };
};
