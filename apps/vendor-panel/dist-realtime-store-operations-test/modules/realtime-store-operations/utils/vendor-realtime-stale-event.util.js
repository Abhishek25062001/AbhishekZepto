"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldIgnoreVendorPickupRealtimeEvent = exports.shouldIgnoreVendorOrderRealtimeEvent = exports.isVendorRealtimeEventStale = void 0;
const isVendorRealtimeEventStale = (incomingUpdatedAt, latestUpdatedAt) => {
    if (!incomingUpdatedAt || !latestUpdatedAt) {
        return false;
    }
    return Date.parse(incomingUpdatedAt) < Date.parse(latestUpdatedAt);
};
exports.isVendorRealtimeEventStale = isVendorRealtimeEventStale;
const shouldIgnoreVendorOrderRealtimeEvent = (incomingEvent, latestEvent) => Boolean(latestEvent &&
    latestEvent.orderId === incomingEvent.orderId &&
    (0, exports.isVendorRealtimeEventStale)(incomingEvent.updatedAt, latestEvent.updatedAt));
exports.shouldIgnoreVendorOrderRealtimeEvent = shouldIgnoreVendorOrderRealtimeEvent;
const shouldIgnoreVendorPickupRealtimeEvent = (incomingEvent, latestEvent) => Boolean(latestEvent &&
    latestEvent.orderId === incomingEvent.orderId &&
    (0, exports.isVendorRealtimeEventStale)(incomingEvent.updatedAt, latestEvent.updatedAt));
exports.shouldIgnoreVendorPickupRealtimeEvent = shouldIgnoreVendorPickupRealtimeEvent;
