import type { AdminOrderDetail, AdminOrderStatus } from '../types/admin-orders.types';

const NEXT_ADMIN_STATUSES: Partial<Record<AdminOrderStatus, AdminOrderStatus[]>> = {
  placed: ['accepted'],
  accepted: ['picking'],
  picking: ['packing'],
  packing: ['ready_for_pickup'],
};

const ADMIN_CANCELLABLE_STATUSES: AdminOrderStatus[] = ['placed', 'accepted', 'picking', 'packing'];

export const getNextAdminOrderStatuses = (status: AdminOrderStatus): AdminOrderStatus[] =>
  NEXT_ADMIN_STATUSES[status] ?? [];

export const canShowAdminStatusUpdateAction = (
  order: Pick<AdminOrderDetail, 'orderStatus'>,
): boolean => getNextAdminOrderStatuses(order.orderStatus).length > 0;

export const canShowAdminCancellationAction = (
  order: Pick<AdminOrderDetail, 'orderStatus'>,
): boolean => ADMIN_CANCELLABLE_STATUSES.includes(order.orderStatus);
