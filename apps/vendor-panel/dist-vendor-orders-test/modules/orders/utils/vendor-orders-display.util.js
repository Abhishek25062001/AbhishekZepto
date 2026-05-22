"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatVendorOrderRefundReview = exports.getVendorOrderCancellationReason = exports.ORDER_HISTORY_CANCELLATION_FIELDS = exports.ORDER_HISTORY_DETAIL_SECTIONS = exports.ORDER_HISTORY_LIST_COLUMNS = exports.ACTIVE_ORDER_DETAIL_SECTIONS = exports.ACTIVE_ORDER_LIST_COLUMNS = exports.INCOMING_ORDER_DETAIL_SECTIONS = exports.INCOMING_ORDER_LIST_COLUMNS = void 0;
exports.INCOMING_ORDER_LIST_COLUMNS = [
    'Order',
    'Order status',
    'Store status',
    'Payment',
    'Total',
    'Placed',
    'SLA',
];
exports.INCOMING_ORDER_DETAIL_SECTIONS = [
    'Summary',
    'Items',
    'State',
];
exports.ACTIVE_ORDER_LIST_COLUMNS = [
    'Order',
    'Order status',
    'Picker',
    'Packing',
    'Items',
    'Total',
    'Accepted',
    'SLA',
];
exports.ACTIVE_ORDER_DETAIL_SECTIONS = [
    'Summary',
    'Items',
    'State',
];
exports.ORDER_HISTORY_LIST_COLUMNS = [
    'Order',
    'Order status',
    'Store status',
    'Payment',
    'Total',
    'Placed',
    'Activity',
];
exports.ORDER_HISTORY_DETAIL_SECTIONS = [
    'Summary',
    'Items',
    'Totals',
    'Timeline',
];
exports.ORDER_HISTORY_CANCELLATION_FIELDS = [
    'Cancelled',
    'Reason',
    'Refund review',
];
const getVendorOrderCancellationReason = ({ cancellationReason, rejectionReason, }) => cancellationReason ?? rejectionReason ?? 'Not set';
exports.getVendorOrderCancellationReason = getVendorOrderCancellationReason;
const formatVendorOrderRefundReview = (refundReviewRequired) => refundReviewRequired ? 'Required' : 'Not required';
exports.formatVendorOrderRefundReview = formatVendorOrderRefundReview;
