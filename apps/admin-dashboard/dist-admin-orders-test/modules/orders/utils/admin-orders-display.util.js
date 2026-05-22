"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminOrderCancellationReason = exports.formatAdminOrderRefundReview = exports.formatAdminOrderDate = exports.formatAdminOrderMoney = exports.ADMIN_ORDER_PAYMENT_STATUS_LABELS = exports.ADMIN_ORDER_STORE_STATUS_LABELS = exports.ADMIN_ORDER_STATUS_LABELS = exports.ADMIN_ORDER_DETAIL_SECTIONS = exports.ADMIN_ORDER_LIST_COLUMNS = exports.ADMIN_ORDER_PAYMENT_STATUSES = exports.ADMIN_ORDER_STORE_STATUSES = exports.ADMIN_ORDER_STATUSES = void 0;
exports.ADMIN_ORDER_STATUSES = [
    'placed',
    'accepted',
    'picking',
    'packing',
    'ready_for_pickup',
    'cancelled',
];
exports.ADMIN_ORDER_STORE_STATUSES = ['pending_acceptance', 'accepted', 'rejected'];
exports.ADMIN_ORDER_PAYMENT_STATUSES = ['paid'];
exports.ADMIN_ORDER_LIST_COLUMNS = [
    'Order',
    'Customer',
    'Store',
    'Status',
    'Store status',
    'Payment',
    'Total',
    'Created',
    'SLA',
];
exports.ADMIN_ORDER_DETAIL_SECTIONS = [
    'Summary',
    'Payment',
    'Items',
    'State',
    'Timeline',
    'SLA',
    'Cancellation',
];
exports.ADMIN_ORDER_STATUS_LABELS = {
    placed: 'Placed',
    accepted: 'Accepted',
    picking: 'Picking',
    packing: 'Packing',
    ready_for_pickup: 'Ready for pickup',
    cancelled: 'Cancelled',
};
exports.ADMIN_ORDER_STORE_STATUS_LABELS = {
    accepted: 'Accepted',
    pending_acceptance: 'Pending acceptance',
    rejected: 'Rejected',
};
exports.ADMIN_ORDER_PAYMENT_STATUS_LABELS = {
    paid: 'Paid',
};
const formatAdminOrderMoney = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', {
    currency,
    style: 'currency',
}).format(amount);
exports.formatAdminOrderMoney = formatAdminOrderMoney;
const formatAdminOrderDate = (value) => value ? new Date(value).toLocaleString('en-IN') : 'Not available';
exports.formatAdminOrderDate = formatAdminOrderDate;
const formatAdminOrderRefundReview = (order) => order.refundReviewRequired ? 'Refund review required' : 'No refund review flag';
exports.formatAdminOrderRefundReview = formatAdminOrderRefundReview;
const getAdminOrderCancellationReason = (order) => order.cancellationReason ?? 'No cancellation reason recorded';
exports.getAdminOrderCancellationReason = getAdminOrderCancellationReason;
