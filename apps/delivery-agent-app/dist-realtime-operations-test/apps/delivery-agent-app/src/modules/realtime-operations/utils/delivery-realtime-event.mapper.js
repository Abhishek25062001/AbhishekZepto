"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDeliveryRealtimeEventPayload = void 0;
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
const DELIVERY_STATUSES = new Set([
    'pending_assignment',
    'assigned',
    'en_route_to_store',
    'arrived_at_store',
    'picked_up',
    'en_route_to_customer',
    'arrived_at_customer',
    'delivered',
    'failed',
    'cancelled',
]);
const ASSIGNMENT_EVENT_NAMES = new Set([
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
]);
const STATUS_EVENT_NAMES = new Set([
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
    delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
]);
const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const toStringValue = (value) => typeof value === 'string' && value.trim() ? value.trim() : null;
const normalizeTimestamp = (value) => {
    const timestamp = toStringValue(value);
    if (!timestamp) {
        return null;
    }
    const parsed = Date.parse(timestamp);
    return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
};
const isDeliveryRealtimeEventName = (value) => typeof value === 'string' &&
    Object.values(delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS).includes(value);
const normalizeDeliveryStatus = (eventName, data) => {
    const rawStatus = toStringValue(data.deliveryStatus) ??
        toStringValue(data.pickupStatus) ??
        toStringValue(data.progressStatus) ??
        toStringValue(data.assignmentStatus) ??
        toStringValue(data.status);
    if (rawStatus && DELIVERY_STATUSES.has(rawStatus)) {
        return rawStatus;
    }
    if (eventName === delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED) {
        return 'cancelled';
    }
    return null;
};
const getUpdatedAt = (payload, data) => normalizeTimestamp(data.updatedAt) ??
    normalizeTimestamp(data.lastLocationUpdatedAt) ??
    normalizeTimestamp(data.pickedUpAt) ??
    normalizeTimestamp(data.arrivedAtStoreAt) ??
    normalizeTimestamp(payload.emittedAt);
const mapDeliveryRealtimeEventPayload = (payload, fallbackEventName) => {
    const eventName = isDeliveryRealtimeEventName(payload.eventName)
        ? payload.eventName
        : fallbackEventName;
    const data = isRecord(payload.data) ? payload.data : {};
    const assignmentId = toStringValue(data.assignmentId) ?? toStringValue(data.deliveryId);
    const orderId = toStringValue(data.orderId);
    const deliveryStatus = normalizeDeliveryStatus(eventName, data);
    const updatedAt = getUpdatedAt(payload, data);
    if (!assignmentId || !orderId || !deliveryStatus || !updatedAt) {
        return null;
    }
    if (ASSIGNMENT_EVENT_NAMES.has(eventName)) {
        const assignmentEvent = {
            eventName: eventName,
            assignmentId,
            orderId,
            deliveryStatus,
            assignmentCode: toStringValue(data.assignmentCode),
            pickupEta: normalizeTimestamp(data.pickupEta) ??
                normalizeTimestamp(data.estimatedPickupAt),
            updatedAt,
            emittedAt: normalizeTimestamp(payload.emittedAt),
            eventId: toStringValue(data.eventId),
            assignment: null,
        };
        return assignmentEvent;
    }
    if (STATUS_EVENT_NAMES.has(eventName)) {
        const statusEvent = {
            eventName: eventName,
            assignmentId,
            orderId,
            deliveryStatus,
            updatedAt,
            emittedAt: normalizeTimestamp(payload.emittedAt),
            eventId: toStringValue(data.eventId),
            rejectionReason: toStringValue(data.rejectionReason) ?? toStringValue(data.failureReason),
        };
        return statusEvent;
    }
    return null;
};
exports.mapDeliveryRealtimeEventPayload = mapDeliveryRealtimeEventPayload;
