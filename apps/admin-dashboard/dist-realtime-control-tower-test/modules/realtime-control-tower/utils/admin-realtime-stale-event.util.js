"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldIgnoreAdminSlaRealtimeEvent = exports.shouldIgnoreAdminDeliveryRealtimeEvent = exports.shouldIgnoreAdminOrderRealtimeEvent = void 0;
const toTime = (value) => {
    if (!value) {
        return null;
    }
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
};
const shouldIgnoreAdminOrderRealtimeEvent = (incoming, latest) => {
    if (!latest || incoming.orderId !== latest.orderId) {
        return false;
    }
    const incomingTime = toTime(incoming.updatedAt);
    const latestTime = toTime(latest.updatedAt);
    return incomingTime !== null && latestTime !== null && incomingTime < latestTime;
};
exports.shouldIgnoreAdminOrderRealtimeEvent = shouldIgnoreAdminOrderRealtimeEvent;
const shouldIgnoreAdminDeliveryRealtimeEvent = (incoming, latest) => {
    if (!latest || incoming.deliveryId !== latest.deliveryId) {
        return false;
    }
    const incomingTime = toTime(incoming.updatedAt);
    const latestTime = toTime(latest.updatedAt);
    return incomingTime !== null && latestTime !== null && incomingTime < latestTime;
};
exports.shouldIgnoreAdminDeliveryRealtimeEvent = shouldIgnoreAdminDeliveryRealtimeEvent;
const shouldIgnoreAdminSlaRealtimeEvent = (incoming, latest) => {
    if (!latest) {
        return false;
    }
    if (incoming.breachId === latest.breachId) {
        return true;
    }
    const sameBreachTarget = incoming.orderId === latest.orderId &&
        incoming.assignmentId === latest.assignmentId &&
        incoming.breachType === latest.breachType;
    if (!sameBreachTarget) {
        return false;
    }
    const incomingTime = toTime(incoming.breachedAt);
    const latestTime = toTime(latest.breachedAt);
    return incomingTime !== null && latestTime !== null && incomingTime <= latestTime;
};
exports.shouldIgnoreAdminSlaRealtimeEvent = shouldIgnoreAdminSlaRealtimeEvent;
