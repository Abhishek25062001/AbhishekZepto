"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatusDescription = exports.canCustomerCancelOrderStatus = exports.isCancelledOrderStatus = exports.isTerminalOrderStatus = exports.getOrderStatusLabel = void 0;
const STATUS_LABELS = {
    accepted: 'Store accepted',
    cancelled: 'Cancelled',
    delivered_placeholder: 'Delivered',
    packing: 'Packing order',
    picking: 'Picking items',
    placed: 'Order placed',
    ready_for_pickup: 'Ready for pickup',
    shipped_placeholder: 'On the way',
};
const getOrderStatusLabel = (status) => STATUS_LABELS[status] ?? 'Order placed';
exports.getOrderStatusLabel = getOrderStatusLabel;
const isTerminalOrderStatus = (status) => status === 'cancelled' || status === 'delivered_placeholder';
exports.isTerminalOrderStatus = isTerminalOrderStatus;
const isCancelledOrderStatus = (status) => status === 'cancelled';
exports.isCancelledOrderStatus = isCancelledOrderStatus;
const canCustomerCancelOrderStatus = (status) => status === 'placed';
exports.canCustomerCancelOrderStatus = canCustomerCancelOrderStatus;
const getOrderStatusDescription = (status) => {
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
exports.getOrderStatusDescription = getOrderStatusDescription;
