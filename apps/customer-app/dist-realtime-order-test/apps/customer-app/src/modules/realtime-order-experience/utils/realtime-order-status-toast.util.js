"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealtimeOrderStatusToastMessage = void 0;
const realtime_order_types_1 = require("../types/realtime-order.types");
const STATUS_MESSAGES = {
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED]: 'Your order has been accepted',
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED]: 'Your order is packed',
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY]: 'Your order is out for delivery',
    [realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED]: 'Your order has been delivered',
};
const getRealtimeOrderStatusToastMessage = (orderStatus) => (orderStatus ? STATUS_MESSAGES[orderStatus] ?? null : null);
exports.getRealtimeOrderStatusToastMessage = getRealtimeOrderStatusToastMessage;
