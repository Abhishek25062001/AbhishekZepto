"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAdminRealtimeEventPayload = void 0;
const control_tower_realtime_types_1 = require("../types/control-tower-realtime.types");
const ADMIN_ORDER_STATUSES = new Set([
    'placed',
    'accepted',
    'picking',
    'packing',
    'ready_for_pickup',
    'shipped',
    'delivered',
    'failed',
    'cancelled',
]);
const ADMIN_STORE_STATUSES = new Set([
    'pending_acceptance',
    'accepted',
    'rejected',
]);
const ADMIN_PICKER_STATUSES = new Set([
    'in_progress',
    'completed',
]);
const ADMIN_PACKING_STATUSES = new Set([
    'in_progress',
    'completed',
    'ready_for_pickup',
]);
const ADMIN_DELIVERY_STATUSES = new Set([
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
const ORDER_EVENT_NAMES = new Set([
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CREATED,
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_DELAYED,
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CANCELLED,
]);
const DELIVERY_EVENT_NAMES = new Set([
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED,
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_STATUS_CHANGED,
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_PROGRESS_UPDATED,
    control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_FAILED,
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
const isAdminRealtimeEventName = (value) => typeof value === 'string' &&
    Object.values(control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS).includes(value);
const normalizeOrderStatus = (eventName, data) => {
    const rawStatus = toStringValue(data.orderStatus) ?? toStringValue(data.status);
    if (rawStatus && ADMIN_ORDER_STATUSES.has(rawStatus)) {
        return rawStatus;
    }
    if (eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.ORDER_CANCELLED) {
        return 'cancelled';
    }
    return null;
};
const normalizeStoreStatus = (data, orderStatus) => {
    const rawStatus = toStringValue(data.storeStatus);
    if (rawStatus && ADMIN_STORE_STATUSES.has(rawStatus)) {
        return rawStatus;
    }
    return orderStatus === 'placed' ? 'pending_acceptance' : 'accepted';
};
const normalizePickerStatus = (value) => {
    const rawStatus = toStringValue(value);
    return rawStatus && ADMIN_PICKER_STATUSES.has(rawStatus)
        ? rawStatus
        : null;
};
const normalizePackingStatus = (value) => {
    const rawStatus = toStringValue(value);
    return rawStatus && ADMIN_PACKING_STATUSES.has(rawStatus)
        ? rawStatus
        : null;
};
const normalizeDeliveryStatus = (eventName, data) => {
    const rawStatus = toStringValue(data.deliveryStatus) ??
        toStringValue(data.progressStatus) ??
        toStringValue(data.status);
    if (rawStatus && ADMIN_DELIVERY_STATUSES.has(rawStatus)) {
        return rawStatus;
    }
    if (eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_FAILED) {
        return 'failed';
    }
    if (eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_ASSIGNMENT_CREATED) {
        return 'assigned';
    }
    return null;
};
const getUpdatedAt = (payload, data) => normalizeTimestamp(data.updatedAt) ??
    normalizeTimestamp(data.lastLocationUpdatedAt) ??
    normalizeTimestamp(data.breachedAt) ??
    normalizeTimestamp(data.createdAt) ??
    normalizeTimestamp(payload.emittedAt);
const buildAdminLiveOrder = (data, orderId, orderStatus, updatedAt) => {
    const customerId = toStringValue(data.customerId);
    const storeId = toStringValue(data.storeId);
    const grandTotal = toNumberValue(data.grandTotal) ??
        toNumberValue(data.totalAmount) ??
        toNumberValue(data.amount);
    const itemCount = toNumberValue(data.itemCount);
    if (!customerId || !storeId || grandTotal === null || itemCount === null) {
        return null;
    }
    return {
        orderId,
        orderNumber: toStringValue(data.orderNumber) ?? orderId,
        customerId,
        storeId,
        cityId: toStringValue(data.cityId),
        orderStatus,
        storeStatus: normalizeStoreStatus(data, orderStatus),
        pickerStatus: normalizePickerStatus(data.pickerStatus),
        packingStatus: normalizePackingStatus(data.packingStatus),
        paymentStatus: 'paid',
        grandTotal,
        currency: toStringValue(data.currency) ?? 'INR',
        placedAt: normalizeTimestamp(data.placedAt) ??
            normalizeTimestamp(data.createdAt) ??
            updatedAt,
        createdAt: normalizeTimestamp(data.createdAt) ?? updatedAt,
        acceptedAt: normalizeTimestamp(data.acceptedAt),
        itemCount,
        slaStatus: toStringValue(data.slaStatus),
        slaBreachedStage: toStringValue(data.slaBreachedStage),
        updatedAt,
    };
};
const mapOrderEvent = (eventName, payload, data) => {
    const orderId = toStringValue(data.orderId) ?? toStringValue(data._id);
    const orderStatus = normalizeOrderStatus(eventName, data);
    const updatedAt = getUpdatedAt(payload, data);
    if (!orderId || !orderStatus || !updatedAt) {
        return null;
    }
    return {
        eventName: eventName,
        orderId,
        cityId: toStringValue(data.cityId),
        orderStatus,
        paymentStatus: 'paid',
        updatedAt,
        emittedAt: normalizeTimestamp(payload.emittedAt),
        eventId: toStringValue(data.eventId),
        order: buildAdminLiveOrder(data, orderId, orderStatus, updatedAt),
    };
};
const mapDeliveryEvent = (eventName, payload, data) => {
    const deliveryId = toStringValue(data.deliveryId) ??
        toStringValue(data.assignmentId) ??
        toStringValue(data._id);
    const orderId = toStringValue(data.orderId);
    const deliveryStatus = normalizeDeliveryStatus(eventName, data);
    const updatedAt = getUpdatedAt(payload, data);
    if (!deliveryId || !orderId || !deliveryStatus || !updatedAt) {
        return null;
    }
    const delivery = {
        deliveryId,
        orderId,
        cityId: toStringValue(data.cityId),
        deliveryAgentId: toStringValue(data.deliveryAgentId) ?? toStringValue(data.riderId),
        deliveryStatus,
        latitude: toNumberValue(data.latitude) ?? toNumberValue(data.currentLatitude),
        longitude: toNumberValue(data.longitude) ?? toNumberValue(data.currentLongitude),
        heading: toNumberValue(data.heading),
        speed: toNumberValue(data.speed),
        updatedAt,
    };
    return {
        eventName: eventName,
        deliveryId,
        orderId,
        cityId: delivery.cityId,
        deliveryAgentId: delivery.deliveryAgentId,
        deliveryStatus,
        updatedAt,
        emittedAt: normalizeTimestamp(payload.emittedAt),
        eventId: toStringValue(data.eventId),
        delivery,
    };
};
const mapSlaEvent = (payload, data) => {
    const breachId = toStringValue(data.breachId) ??
        toStringValue(data.slaBreachId) ??
        toStringValue(data.eventId);
    const orderId = toStringValue(data.orderId);
    const breachedAt = normalizeTimestamp(data.breachedAt) ??
        normalizeTimestamp(data.createdAt) ??
        normalizeTimestamp(payload.emittedAt);
    if (!breachId || !orderId || !breachedAt) {
        return null;
    }
    return {
        eventName: control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
        breachId,
        orderId,
        assignmentId: toStringValue(data.assignmentId) ?? toStringValue(data.deliveryAssignmentId),
        deliveryId: toStringValue(data.deliveryId),
        cityId: toStringValue(data.cityId),
        breachType: toStringValue(data.breachType) ??
            toStringValue(data.slaType) ??
            'delivery_sla',
        escalationLevel: toStringValue(data.escalationLevel),
        breachedAt,
        emittedAt: normalizeTimestamp(payload.emittedAt),
        eventId: toStringValue(data.eventId),
    };
};
const mapAdminRealtimeEventPayload = (payload, fallbackEventName) => {
    const eventName = isAdminRealtimeEventName(payload.eventName)
        ? payload.eventName
        : fallbackEventName;
    const data = isRecord(payload.data) ? payload.data : {};
    if (ORDER_EVENT_NAMES.has(eventName)) {
        return mapOrderEvent(eventName, payload, data);
    }
    if (DELIVERY_EVENT_NAMES.has(eventName)) {
        return mapDeliveryEvent(eventName, payload, data);
    }
    if (eventName === control_tower_realtime_types_1.ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED) {
        return mapSlaEvent(payload, data);
    }
    return null;
};
exports.mapAdminRealtimeEventPayload = mapAdminRealtimeEventPayload;
