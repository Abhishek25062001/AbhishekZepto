import type { OrderListQuery } from '../types/order.types';

export const orderQueryKeys = {
  all: ['customer-orders'] as const,
  detail: (orderId: string) => [...orderQueryKeys.all, 'detail', orderId] as const,
  lifecycle: (orderId: string) => [...orderQueryKeys.all, 'lifecycle', orderId] as const,
  delivery: (orderId: string) => [...orderQueryKeys.all, 'delivery', orderId] as const,
  list: (query: OrderListQuery) => [...orderQueryKeys.all, 'list', query] as const,
  lists: () => [...orderQueryKeys.all, 'list'] as const,
  state: (orderId: string) => [...orderQueryKeys.all, 'state', orderId] as const,
};
