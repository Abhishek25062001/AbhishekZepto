export const INCOMING_ORDER_LIST_COLUMNS = [
  'Order',
  'Order status',
  'Store status',
  'Payment',
  'Total',
  'Placed',
  'SLA',
] as const;

export const INCOMING_ORDER_DETAIL_SECTIONS = [
  'Summary',
  'Items',
  'State',
] as const;

export const ACTIVE_ORDER_LIST_COLUMNS = [
  'Order',
  'Order status',
  'Picker',
  'Packing',
  'Items',
  'Total',
  'Accepted',
  'SLA',
] as const;

export const ACTIVE_ORDER_DETAIL_SECTIONS = [
  'Summary',
  'Items',
  'State',
] as const;

export const ORDER_HISTORY_LIST_COLUMNS = [
  'Order',
  'Order status',
  'Store status',
  'Payment',
  'Total',
  'Placed',
  'Activity',
] as const;

export const ORDER_HISTORY_DETAIL_SECTIONS = [
  'Summary',
  'Items',
  'Totals',
  'Timeline',
] as const;

export const ORDER_HISTORY_CANCELLATION_FIELDS = [
  'Cancelled',
  'Reason',
  'Refund review',
] as const;

export const getVendorOrderCancellationReason = ({
  cancellationReason,
  rejectionReason,
}: {
  cancellationReason: string | null;
  rejectionReason: string | null;
}) => cancellationReason ?? rejectionReason ?? 'Not set';

export const formatVendorOrderRefundReview = (refundReviewRequired: boolean) =>
  refundReviewRequired ? 'Required' : 'Not required';
