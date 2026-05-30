"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeliveryRealtimeStore = void 0;
const zustand_1 = require("zustand");
const normalizeAssignmentId = (assignmentId) => assignmentId.trim();
const getRealtimeEventTimestamp = (event) => event.emittedAt ?? event.updatedAt ?? new Date().toISOString();
exports.useDeliveryRealtimeStore = (0, zustand_1.create)((set) => ({
    socketConnected: false,
    connectionState: 'idle',
    activeAssignmentRooms: [],
    lastAssignmentEvent: null,
    lastStatusEvent: null,
    lastLocationAckAt: null,
    locationSyncPaused: false,
    locationSyncError: null,
    connectionError: null,
    lastRealtimeEventAt: null,
    setSocketConnected: (connected) => set({
        socketConnected: connected,
        connectionState: connected ? 'connected' : 'disconnected',
        connectionError: connected ? null : undefined,
    }),
    setConnectionState: (connectionState) => set({ connectionState }),
    setConnectionError: (connectionError) => set({ connectionError }),
    addAssignmentRoom: (assignmentId) => set((state) => {
        const normalizedAssignmentId = normalizeAssignmentId(assignmentId);
        if (!normalizedAssignmentId ||
            state.activeAssignmentRooms.includes(normalizedAssignmentId)) {
            return state;
        }
        return {
            activeAssignmentRooms: [
                ...state.activeAssignmentRooms,
                normalizedAssignmentId,
            ],
        };
    }),
    removeAssignmentRoom: (assignmentId) => set((state) => {
        const normalizedAssignmentId = normalizeAssignmentId(assignmentId);
        return {
            activeAssignmentRooms: state.activeAssignmentRooms.filter((activeAssignmentId) => activeAssignmentId !== normalizedAssignmentId),
        };
    }),
    setLastAssignmentEvent: (event) => set({
        lastAssignmentEvent: event,
        lastRealtimeEventAt: getRealtimeEventTimestamp(event),
    }),
    setLastStatusEvent: (event) => set((state) => ({
        lastStatusEvent: event,
        lastRealtimeEventAt: getRealtimeEventTimestamp(event),
        lastLocationAckAt: event.eventName === 'delivery.location_sync_acknowledged'
            ? getRealtimeEventTimestamp(event)
            : state.lastLocationAckAt,
        locationSyncPaused: event.eventName === 'delivery.location_sync_acknowledged'
            ? false
            : state.locationSyncPaused,
        locationSyncError: event.eventName === 'delivery.location_sync_acknowledged'
            ? null
            : state.locationSyncError,
    })),
    setLastLocationAckAt: (lastLocationAckAt) => set({ lastLocationAckAt }),
    setLocationSyncPaused: (paused) => set({ locationSyncPaused: paused }),
    setLocationSyncError: (error) => set({ locationSyncError: error }),
    clearDeliveryRealtimeState: () => set({
        socketConnected: false,
        connectionState: 'idle',
        activeAssignmentRooms: [],
        lastAssignmentEvent: null,
        lastStatusEvent: null,
        lastLocationAckAt: null,
        locationSyncPaused: false,
        locationSyncError: null,
        connectionError: null,
        lastRealtimeEventAt: null,
    }),
}));
