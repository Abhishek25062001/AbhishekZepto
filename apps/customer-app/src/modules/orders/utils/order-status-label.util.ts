import type { OrderStatus } from '../types/order.types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  accepted: 'Store accepted',
  cancelled: 'Cancelled',
  delivered_placeholder: 'Delivered',
  packing: 'Packing order',
  picking: 'Picking items',
  placed: 'Order placed',
  ready_for_pickup: 'Ready for pickup',
  shipped_placeholder: 'On the way',
};

export const getOrderStatusLabel = (status: OrderStatus | string): string =>
  STATUS_LABELS[status as OrderStatus] ?? 'Order placed';

export const isTerminalOrderStatus = (status: OrderStatus | string): boolean =>
  status === 'cancelled' || status === 'delivered_placeholder';

export const isCancelledOrderStatus = (status: OrderStatus | string): boolean =>
  status === 'cancelled';

export const canCustomerCancelOrderStatus = (status: OrderStatus | string): boolean =>
  status === 'placed';

export const getOrderStatusDescription = (status: OrderStatus | string): string => {
  switch (status) {
    case 'accepted':
      return 'The store has accepted your order.';
    case 'picking':
      return 'The store is picking your items.';
    case 'packing':
      return 'Your items are being packed.';
    case 'ready_for_pickup':
      return 'Your order is ready for delivery pickup.';
    case 'shipped_placeholder':
      return 'Delivery progress will be available in a later phase.';
    case 'delivered_placeholder':
      return 'This order is marked delivered.';
    case 'cancelled':
      return 'This order has been cancelled.';
    case 'placed':
    default:
      return 'Your order was placed successfully.';
  }
};
