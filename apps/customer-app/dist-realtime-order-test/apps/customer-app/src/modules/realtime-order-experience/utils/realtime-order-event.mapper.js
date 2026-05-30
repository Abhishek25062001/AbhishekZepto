"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRealtimeOrderEventPayload = void 0;
const realtime_order_types_1 = require("../types/realtime-order.types");
const ORDER_EVENT_NAMES = new Set([
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_ACCEPTED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_PACKED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_READY_FOR_PICKUP,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
    realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_CANCELLED,
]);
const STATUS_BY_BACKEND_STATUS = {
    placed: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.CREATED,
    created: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.CREATED,
    accepted: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED,
    picking: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED,
    packing: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
    packed: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
    ready_for_pickup: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.READY_FOR_PICKUP,
    shipped: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY,
    out_for_delivery: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY,
    delivered: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED,
    cancelled: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.CANCELLED,
    failed: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.FAILED,
};
const STATUS_BY_EVENT_NAME = {
    [realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_ACCEPTED]: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.ACCEPTED,
    [realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_PACKED]: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.PACKED,
    [realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_READY_FOR_PICKUP]: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.READY_FOR_PICKUP,
    [realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY]: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.OUT_FOR_DELIVERY,
    [realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED]: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED,
    [realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_CANCELLED]: realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.CANCELLED,
};
const isRecord = (value) => Boolean(value) && typeof value === 'object';
const toStringValue = (value) => typeof value === 'string' && value.trim() ? value.trim() : null;
const isCustomerRealtimeEventName = (value) => typeof value === 'string' &&
    Object.values(realtime_order_types_1.CUSTOMER_REALTIME_EVENTS).includes(value);
const normalizeTimestamp = (value) => {
    const timestamp = toStringValue(value);
    if (!timestamp) {
        return null;
    }
    const parsed = Date.parse(timestamp);
    return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
};
const normalizeOrderStatus = (eventName, data) => {
    const rawStatus = toStringValue(data.orderStatus) ?? toStringValue(data.status);
    if (rawStatus && STATUS_BY_BACKEND_STATUS[rawStatus]) {
        return STATUS_BY_BACKEND_STATUS[rawStatus];
    }
    return STATUS_BY_EVENT_NAME[eventName] ?? null;
};
const mapRealtimeOrderEventPayload = (payload, fallbackEventName) => {
    const eventName = isCustomerRealtimeEventName(payload.eventName)
        ? payload.eventName
        : fallbackEventName;
    if (!ORDER_EVENT_NAMES.has(eventName)) {
        return null;
    }
    const data = isRecord(payload.data) ? payload.data : {};
    const orderId = toStringValue(data.orderId);
    const orderStatus = normalizeOrderStatus(eventName, data);
    const updatedAt = normalizeTimestamp(data.updatedAt) ?? normalizeTimestamp(payload.emittedAt);
    if (!orderId || !orderStatus || !updatedAt) {
        return null;
    }
    return {
        eventName,
        orderId,
        orderStatus,
        updatedAt,
        eventId: toStringValue(data.eventId),
        emittedAt: normalizeTimestamp(payload.emittedAt),
    };
};
exports.mapRealtimeOrderEventPayload = mapRealtimeOrderEventPayload;
