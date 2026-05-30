import {
  CUSTOMER_REALTIME_ORDER_STATUS,
  type CustomerRealtimeOrderStatus,
} from '../types/realtime-order.types';

const STATUS_MESSAGES: Partial<Record<CustomerRealtimeOrderStatus, string>> = {
  [CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED]: 'Your order has been accepted',
  [CUSTOMER_REALTIME_ORDER_STATUS.PACKED]: 'Your order is packed',
  [CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY]: 'Your order is out for delivery',
  [CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED]: 'Your order has been delivered',
};

export const getRealtimeOrderStatusToastMessage = (
  orderStatus: CustomerRealtimeOrderStatus | null | undefined,
): string | null => (orderStatus ? STATUS_MESSAGES[orderStatus] ?? null : null);
