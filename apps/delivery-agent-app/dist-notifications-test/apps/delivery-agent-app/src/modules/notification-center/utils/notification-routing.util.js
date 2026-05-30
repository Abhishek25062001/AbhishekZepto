"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationTarget = void 0;
const getNotificationTarget = (notification) => {
    if (notification.notificationType === 'assignment_update') {
        return typeof notification.dataPayload.assignmentId === 'string'
            ? `assignment:${notification.dataPayload.assignmentId}`
            : 'assignments';
    }
    if (notification.notificationType === 'delivery_update') {
        return 'active-delivery';
    }
    return null;
};
exports.getNotificationTarget = getNotificationTarget;
