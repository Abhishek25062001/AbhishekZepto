"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVendorRealtimeStore = void 0;
const zustand_1 = require("zustand");
const normalizeOrderId = (orderId) => orderId.trim();
const getRealtimeEventTimestamp = (event) => event.emittedAt ?? event.updatedAt ?? new Date().toISOString();
exports.useVendorRealtimeStore = (0, zustand_1.create)((set) => ({
    socketConnected: false,
    connectionState: 'idle',
    activeOrderRooms: [],
    lastOrderEvent: null,
    lastPickupEvent: null,
    connectionError: null,
    lastRealtimeEventAt: null,
    setSocketConnected: (connected) => set({
        socketConnected: connected,
        connectionState: connected ? 'connected' : 'disconnected',
        connectionError: connected ? null : undefined,
    }),
    setConnectionState: (connectionState) => set({ connectionState }),
    setConnectionError: (connectionError) => set({ connectionError }),
    addOrderRoom: (orderId) => set((state) => {
        const normalizedOrderId = normalizeOrderId(orderId);
        if (!normalizedOrderId || state.activeOrderRooms.includes(normalizedOrderId)) {
            return state;
        }
        return {
            activeOrderRooms: [...state.activeOrderRooms, normalizedOrderId],
        };
    }),
    removeOrderRoom: (orderId) => set((state) => {
        const normalizedOrderId = normalizeOrderId(orderId);
        return {
            activeOrderRooms: state.activeOrderRooms.filter((activeOrderId) => activeOrderId !== normalizedOrderId),
        };
    }),
    setLastOrderEvent: (event) => set({
        lastOrderEvent: event,
        lastRealtimeEventAt: getRealtimeEventTimestamp(event),
    }),
    setLastPickupEvent: (event) => set({
        lastPickupEvent: event,
        lastRealtimeEventAt: getRealtimeEventTimestamp(event),
    }),
    clearVendorRealtimeState: () => set({
        socketConnected: false,
        connectionState: 'idle',
        activeOrderRooms: [],
        lastOrderEvent: null,
        lastPickupEvent: null,
        connectionError: null,
        lastRealtimeEventAt: null,
    }),
}));
