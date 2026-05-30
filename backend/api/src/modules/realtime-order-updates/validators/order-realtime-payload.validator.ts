import { ORDER_STATUS_VALUES } from '../../orders/constants/order-status.constant';
import type { OrderRealtimeEventName } from '../constants/order-realtime-events.constant';
import { ORDER_REALTIME_EVENTS } from '../constants/order-realtime-events.constant';
import type { OrderRealtimePayload } from '../types/order-realtime.types';

const BLOCKED_PAYLOAD_FIELDS = [
  'accessToken',
  'refreshToken',
  'otp',
  'paymentGatewaySecret',
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

export const validateOrderRealtimePayload = (
  eventName: OrderRealtimeEventName,
  payload: OrderRealtimePayload,
): void => {
  if (!payload.orderId) {
    throw new Error('Order realtime payload requires orderId');
  }

  if (
    eventName.startsWith('customer.') &&
    !payload.customerId
  ) {
    throw new Error('Customer order realtime event requires customerId');
  }

  if (
    eventName.startsWith('vendor.') &&
    !payload.storeId
  ) {
    throw new Error('Vendor order realtime event requires storeId');
  }

  if (!ORDER_STATUS_VALUES.includes(payload.orderStatus as never)) {
    throw new Error('Order realtime payload contains invalid orderStatus');
  }

  if (hasBlockedField(payload)) {
    throw new Error('Order realtime payload contains blocked fields');
  }
};

export const isOrderRealtimeStatusEvent = (
  eventName: OrderRealtimeEventName,
): boolean =>
  eventName === ORDER_REALTIME_EVENTS.CUSTOMER_ORDER_STATUS_UPDATED ||
  eventName === ORDER_REALTIME_EVENTS.VENDOR_ORDER_STATUS_UPDATED ||
  eventName === ORDER_REALTIME_EVENTS.ADMIN_ORDER_STATUS_UPDATED;
