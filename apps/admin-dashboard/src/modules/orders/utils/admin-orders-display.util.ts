import type {
  AdminOrderDetail,
  AdminOrderPaymentStatus,
  AdminOrderStatus,
  AdminOrderStoreStatus,
} from '../types/admin-orders.types';

export const ADMIN_ORDER_STATUSES = [
  'placed',
  'accepted',
  'picking',
  'packing',
  'ready_for_pickup',
  'shipped',
  'delivered',
  'failed',
  'cancelled',
] as const;

export const ADMIN_ORDER_STORE_STATUSES = ['pending_acceptance', 'accepted', 'rejected'] as const;

export const ADMIN_ORDER_PAYMENT_STATUSES = ['paid'] as const;

export const ADMIN_ORDER_LIST_COLUMNS = [
  'Order',
  'Customer',
  'Store',
  'Status',
  'Store status',
  'Payment',
  'Total',
  'Created',
  'SLA',
] as const;

export const ADMIN_ORDER_DETAIL_SECTIONS = [
  'Summary',
  'Payment',
  'Items',
  'State',
  'Timeline',
  'SLA',
  'Cancellation',
] as const;

export const ADMIN_ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  placed: 'Placed',
  accepted: 'Accepted',
  picking: 'Picking',
  packing: 'Packing',
  ready_for_pickup: 'Ready for pickup',
  shipped: 'Shipped',
  delivered: 'Delivered',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export const ADMIN_ORDER_STORE_STATUS_LABELS: Record<AdminOrderStoreStatus, string> = {
  accepted: 'Accepted',
  pending_acceptance: 'Pending acceptance',
  rejected: 'Rejected',
};

export const ADMIN_ORDER_PAYMENT_STATUS_LABELS: Record<AdminOrderPaymentStatus, string> = {
  paid: 'Paid',
};

export const formatAdminOrderMoney = (amount: number, currency = 'INR'): string =>
  new Intl.NumberFormat('en-IN', {
    currency,
    style: 'currency',
  }).format(amount);

export const formatAdminOrderDate = (value?: string | null): string =>
  value ? new Date(value).toLocaleString('en-IN') : 'Not available';

export const formatAdminOrderRefundReview = (order: Pick<AdminOrderDetail, 'refundReviewRequired'>): string =>
  order.refundReviewRequired ? 'Refund review required' : 'No refund review flag';

export const getAdminOrderCancellationReason = (
  order: Pick<AdminOrderDetail, 'cancellationReason'>,
): string => order.cancellationReason ?? 'No cancellation reason recorded';
