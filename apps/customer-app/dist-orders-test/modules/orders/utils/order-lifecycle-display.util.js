"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerTimelineEventReason = exports.getCustomerTimelineEventLabel = void 0;
const order_status_label_util_1 = require("./order-status-label.util");
const getCustomerTimelineEventLabel = (event) => {
    if (!event.toStatus) {
        return 'Order update';
    }
    return (0, order_status_label_util_1.getOrderStatusLabel)(event.toStatus);
};
exports.getCustomerTimelineEventLabel = getCustomerTimelineEventLabel;
const getCustomerTimelineEventReason = (event) => {
    const reason = event.reason?.trim();
    return reason ? reason : null;
};
exports.getCustomerTimelineEventReason = getCustomerTimelineEventReason;
