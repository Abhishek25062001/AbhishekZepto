import type {
  AdminOrderListItem,
  AdminOrderListQuery,
} from '../../orders/types/admin-orders.types';
import type {
  AdminLiveOrder,
  AdminOrderRealtimeEvent,
} from '../types/control-tower-realtime.types';
import { applyAdminRealtimeOrderEventToList } from './live-orders.util';

const matchesOrderQuery = (
  order: AdminLiveOrder,
  query: AdminOrderListQuery,
): boolean => {
  if (query.status && order.orderStatus !== query.status) {
    return false;
  }

  if (query.storeStatus && order.storeStatus !== query.storeStatus) {
    return false;
  }

  if (query.storeId && order.storeId !== query.storeId) {
    return false;
  }

  if (query.cityId && order.cityId !== query.cityId) {
    return false;
  }

  if (query.paymentStatus && order.paymentStatus !== query.paymentStatus) {
    return false;
  }

  if (query.customerId && order.customerId !== query.customerId) {
    return false;
  }

  if (query.slaStatus && order.slaStatus !== query.slaStatus) {
    return false;
  }

  if (
    query.slaBreachedStage &&
    order.slaBreachedStage !== query.slaBreachedStage
  ) {
    return false;
  }

  if (query.fromDate && new Date(order.createdAt) < new Date(query.fromDate)) {
    return false;
  }

  if (query.toDate && new Date(order.createdAt) > new Date(query.toDate)) {
    return false;
  }

  return true;
};

const toLiveOrder = (order: AdminOrderListItem): AdminLiveOrder => ({
  ...order,
  updatedAt: order.createdAt,
});

export const applyAdminRealtimeOrderEventToAdminOrdersList = (
  orders: AdminOrderListItem[],
  event: AdminOrderRealtimeEvent | null,
  query: AdminOrderListQuery,
): AdminOrderListItem[] =>
  applyAdminRealtimeOrderEventToList(
    orders.map(toLiveOrder),
    event,
    (order) => matchesOrderQuery(order, query),
  );
