"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldIgnoreStatusRealtimeEvent = exports.shouldIgnoreAssignmentRealtimeEvent = exports.isDeliveryRealtimeEventStale = void 0;
const isDeliveryRealtimeEventStale = (incomingUpdatedAt, latestUpdatedAt) => {
    if (!incomingUpdatedAt || !latestUpdatedAt) {
        return false;
    }
    return Date.parse(incomingUpdatedAt) < Date.parse(latestUpdatedAt);
};
exports.isDeliveryRealtimeEventStale = isDeliveryRealtimeEventStale;
const shouldIgnoreAssignmentRealtimeEvent = (incomingEvent, latestEvent) => Boolean(latestEvent &&
    latestEvent.assignmentId === incomingEvent.assignmentId &&
    (0, exports.isDeliveryRealtimeEventStale)(incomingEvent.updatedAt, latestEvent.updatedAt));
exports.shouldIgnoreAssignmentRealtimeEvent = shouldIgnoreAssignmentRealtimeEvent;
const shouldIgnoreStatusRealtimeEvent = (incomingEvent, latestEvent) => Boolean(latestEvent &&
    latestEvent.assignmentId === incomingEvent.assignmentId &&
    (0, exports.isDeliveryRealtimeEventStale)(incomingEvent.updatedAt, latestEvent.updatedAt));
exports.shouldIgnoreStatusRealtimeEvent = shouldIgnoreStatusRealtimeEvent;
