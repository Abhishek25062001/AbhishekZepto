"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldShowPriorityNotificationAlert = exports.getNotificationFromRealtimePayload = exports.NOTIFICATION_CREATED_EVENT = void 0;
exports.NOTIFICATION_CREATED_EVENT = 'notification.created';
const isNotificationRecord = (value) => {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value;
    return (typeof candidate.id === 'string' &&
        typeof candidate.notificationType === 'string' &&
        typeof candidate.title === 'string' &&
        typeof candidate.message === 'string' &&
        typeof candidate.priority === 'string' &&
        typeof candidate.isRead === 'boolean' &&
        typeof candidate.createdAt === 'string');
};
const getNotificationFromRealtimePayload = (payload) => {
    const data = payload.data;
    if (isNotificationRecord(data)) {
        return data;
    }
    if (data &&
        typeof data === 'object' &&
        'notification' in data &&
        isNotificationRecord(data.notification)) {
        return data.notification;
    }
    return null;
};
exports.getNotificationFromRealtimePayload = getNotificationFromRealtimePayload;
const shouldShowPriorityNotificationAlert = (notification) => notification.priority === 'high' || notification.priority === 'critical';
exports.shouldShowPriorityNotificationAlert = shouldShowPriorityNotificationAlert;
