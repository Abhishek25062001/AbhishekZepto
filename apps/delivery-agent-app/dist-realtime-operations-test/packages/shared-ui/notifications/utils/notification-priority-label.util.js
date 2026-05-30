"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationPriorityLabel = void 0;
const NOTIFICATION_PRIORITY_LABEL = {
    critical: 'Critical',
    high: 'High',
    low: 'Low',
    normal: 'Normal',
};
const getNotificationPriorityLabel = (priority) => NOTIFICATION_PRIORITY_LABEL[priority];
exports.getNotificationPriorityLabel = getNotificationPriorityLabel;
