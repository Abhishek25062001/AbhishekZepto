import type {
  CustomerPushDataPayload,
  CustomerPushNavigation,
} from '../types/customer-push.types';

const getOrderId = (payload: CustomerPushDataPayload): string | null =>
  typeof payload.orderId === 'string' && payload.orderId.trim()
    ? payload.orderId.trim()
    : null;

export const handleCustomerPushPayload = (
  payload: CustomerPushDataPayload,
  navigation: CustomerPushNavigation,
): boolean => {
  const orderId = getOrderId(payload);

  if (payload.type === 'order_out_for_delivery' && orderId) {
    navigation.navigate('DeliveryTracking', { orderId });
    return true;
  }

  if (payload.type === 'order_delivered' && orderId) {
    navigation.navigate('OrderDetail', { orderId });
    return true;
  }

  if (payload.type === 'delivery_failed' && orderId) {
    navigation.navigate('OrderDetail', { orderId });
    return true;
  }

  return false;
};
