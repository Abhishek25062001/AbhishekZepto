"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapVendorRealtimeEventPayload = void 0;
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
const VENDOR_ORDER_STATUSES = new Set([
    'placed',
    'accepted',
    'picking',
    'packing',
    'ready_for_pickup',
    'cancelled',
]);
const VENDOR_STORE_STATUSES = new Set([
    'pending_acceptance',
    'accepted',
    'rejected',
]);
const ORDER_EVENT_NAMES = new Set([
    vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED,
    vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
    vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CANCELLED,
]);
const PICKUP_EVENT_NAMES = new Set([
    vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
    vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
]);
const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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
const isVendorRealtimeEventName = (value) => typeof value === 'string' &&
    Object.values(vendor_realtime_types_1.VENDOR_REALTIME_EVENTS).includes(value);
const normalizeOrderStatus = (eventName, data) => {
    const rawStatus = toStringValue(data.orderStatus) ?? toStringValue(data.status);
    if (rawStatus && VENDOR_ORDER_STATUSES.has(rawStatus)) {
        return rawStatus;
    }
    if (eventName === vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CANCELLED) {
        return 'cancelled';
    }
    return null;
};
const normalizeStoreStatus = (data, orderStatus) => {
    const rawStatus = toStringValue(data.storeStatus);
    if (rawStatus && VENDOR_STORE_STATUSES.has(rawStatus)) {
        return rawStatus;
    }
    return orderStatus === 'placed' ? 'pending_acceptance' : 'accepted';
};
const buildVendorOrderListItem = (data, orderId, storeId, orderStatus, totalAmount, itemCount, updatedAt) => ({
    orderId,
    orderNumber: toStringValue(data.orderNumber) ?? orderId,
    customerId: toStringValue(data.customerId) ?? '',
    storeId,
    orderStatus,
    storeStatus: normalizeStoreStatus(data, orderStatus),
    pickerStatus: toStringValue(data.pickerStatus),
    packingStatus: toStringValue(data.packingStatus),
    paymentStatus: 'paid',
    grandTotal: totalAmount,
    currency: toStringValue(data.currency) ?? 'INR',
    placedAt: normalizeTimestamp(data.placedAt) ??
        normalizeTimestamp(data.createdAt) ??
        updatedAt,
    createdAt: normalizeTimestamp(data.createdAt) ?? updatedAt,
    acceptedAt: normalizeTimestamp(data.acceptedAt),
    itemCount,
    slaStatus: toStringValue(data.slaStatus),
    slaBreachedStage: toStringValue(data.slaBreachedStage),
});
const getUpdatedAt = (payload, data) => normalizeTimestamp(data.updatedAt) ??
    normalizeTimestamp(data.createdAt) ??
    normalizeTimestamp(data.arrivedAt) ??
    normalizeTimestamp(data.pickupCompletedAt) ??
    normalizeTimestamp(payload.emittedAt);
const mapVendorRealtimeEventPayload = (payload, fallbackEventName) => {
    const eventName = isVendorRealtimeEventName(payload.eventName)
        ? payload.eventName
        : fallbackEventName;
    const data = isRecord(payload.data) ? payload.data : {};
    const orderId = toStringValue(data.orderId) ?? toStringValue(data._id);
    const updatedAt = getUpdatedAt(payload, data);
    if (!orderId || !updatedAt) {
        return null;
    }
    if (ORDER_EVENT_NAMES.has(eventName)) {
        const storeId = toStringValue(data.storeId);
        const orderStatus = normalizeOrderStatus(eventName, data);
        const totalAmount = toNumberValue(data.totalAmount) ??
            toNumberValue(data.grandTotal) ??
            toNumberValue(data.amount);
        const itemCount = toNumberValue(data.itemCount);
        if (!storeId || !orderStatus || totalAmount === null || itemCount === null) {
            return null;
        }
        const orderEvent = {
            eventName: eventName,
            orderId,
            storeId,
            orderStatus,
            totalAmount,
            itemCount,
            updatedAt,
            emittedAt: normalizeTimestamp(payload.emittedAt),
            eventId: toStringValue(data.eventId),
            order: buildVendorOrderListItem(data, orderId, storeId, orderStatus, totalAmount, itemCount, updatedAt),
        };
        return orderEvent;
    }
    if (PICKUP_EVENT_NAMES.has(eventName)) {
        const assignmentId = toStringValue(data.assignmentId) ?? toStringValue(data.deliveryId);
        const riderId = toStringValue(data.riderId) ?? toStringValue(data.deliveryAgentId);
        const pickupStatus = eventName === vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED
            ? 'pickup_completed'
            : 'arrived_at_store';
        if (!assignmentId || !riderId) {
            return null;
        }
        const pickupEvent = {
            eventName: eventName,
            orderId,
            assignmentId,
            riderId,
            pickupStatus,
            arrivedAt: normalizeTimestamp(data.arrivedAt),
            pickupCompletedAt: normalizeTimestamp(data.pickupCompletedAt),
            updatedAt,
            emittedAt: normalizeTimestamp(payload.emittedAt),
            eventId: toStringValue(data.eventId),
        };
        return pickupEvent;
    }
    return null;
};
exports.mapVendorRealtimeEventPayload = mapVendorRealtimeEventPayload;
