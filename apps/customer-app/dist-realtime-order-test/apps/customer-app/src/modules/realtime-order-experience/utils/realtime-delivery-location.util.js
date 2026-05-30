"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRealtimeDeliveryTrackingPayload = exports.isLocationEventStale = exports.hasValidRealtimeCoordinates = void 0;
const realtime_order_types_1 = require("../types/realtime-order.types");
const DELIVERY_TRACKING_EVENTS = new Set([
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.RIDER_REACHED_CUSTOMER,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_FAILED,
]);
const isRecord = (value) => Boolean(value) && typeof value === 'object';
const toStringValue = (value) => typeof value === 'string' && value.trim() ? value.trim() : null;
const toNumberValue = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};
const normalizeTimestamp = (value) => {
    const timestamp = toStringValue(value);
    if (!timestamp) {
        return null;
    }
    const parsed = Date.parse(timestamp);
    return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
};
const hasValidRealtimeCoordinates = (latitude, longitude) => typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;
exports.hasValidRealtimeCoordinates = hasValidRealtimeCoordinates;
const isLocationEventStale = (incomingLastLocationUpdatedAt, latestLastLocationUpdatedAt) => {
    if (!incomingLastLocationUpdatedAt || !latestLastLocationUpdatedAt) {
        return false;
    }
    return (Date.parse(incomingLastLocationUpdatedAt) <
        Date.parse(latestLastLocationUpdatedAt));
};
exports.isLocationEventStale = isLocationEventStale;
const mapRealtimeDeliveryTrackingPayload = (payload, fallbackEventName) => {
    const eventName = typeof payload.eventName === 'string' &&
        DELIVERY_TRACKING_EVENTS.has(payload.eventName)
        ? payload.eventName
        : fallbackEventName;
    if (!DELIVERY_TRACKING_EVENTS.has(eventName)) {
        return null;
    }
    const data = isRecord(payload.data) ? payload.data : {};
    const orderId = toStringValue(data.orderId);
    const assignmentId = toStringValue(data.assignmentId);
    const deliveryAgentId = toStringValue(data.deliveryAgentId);
    const currentLatitude = toNumberValue(data.currentLatitude);
    const currentLongitude = toNumberValue(data.currentLongitude);
    const lastLocationUpdatedAt = normalizeTimestamp(data.lastLocationUpdatedAt);
    if (!orderId || !assignmentId || !deliveryAgentId) {
        return null;
    }
    if (eventName === realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED &&
        !(0, exports.hasValidRealtimeCoordinates)(currentLatitude, currentLongitude)) {
        return null;
    }
    return {
        eventName,
        orderId,
        assignmentId,
        deliveryAgentId,
        customerId: toStringValue(data.customerId) ?? '',
        storeId: toStringValue(data.storeId) ?? '',
        cityId: toStringValue(data.cityId) ?? '',
        progressStatus: toStringValue(data.progressStatus) ?? '',
        currentLatitude,
        currentLongitude,
        lastLocationUpdatedAt,
        estimatedDeliveryAt: normalizeTimestamp(data.estimatedDeliveryAt),
        updatedAt: normalizeTimestamp(data.updatedAt),
        eventId: toStringValue(data.eventId),
        emittedAt: normalizeTimestamp(payload.emittedAt),
    };
};
exports.mapRealtimeDeliveryTrackingPayload = mapRealtimeDeliveryTrackingPayload;
