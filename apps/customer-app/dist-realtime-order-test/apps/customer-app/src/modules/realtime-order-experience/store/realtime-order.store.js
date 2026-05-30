"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealtimeOrderStore = void 0;
const zustand_1 = require("zustand");
const normalizeOrderId = (orderId) => orderId.trim();
const getEventTimestamp = (event) => event.emittedAt ?? event.updatedAt ?? new Date().toISOString();
exports.useRealtimeOrderStore = (0, zustand_1.create)((set) => ({
    socketConnected: false,
    connectionState: 'idle',
    activeOrderRooms: [],
    realtimeOrderEvents: [],
    deliveryTrackingEvents: [],
    lastRealtimeEventAt: null,
    connectionError: null,
    setSocketConnected: (connected) => set({
        socketConnected: connected,
        connectionState: connected ? 'connected' : 'disconnected',
        connectionError: connected ? null : undefined,
    }),
    setConnectionState: (connectionState) => set({ connectionState }),
    setConnectionError: (connectionError) => set({ connectionError }),
    addRealtimeOrderEvent: (event) => set((state) => ({
        realtimeOrderEvents: [...state.realtimeOrderEvents, event],
        lastRealtimeEventAt: getEventTimestamp(event),
    })),
    addDeliveryTrackingEvent: (event) => set((state) => ({
        deliveryTrackingEvents: [...state.deliveryTrackingEvents, event],
        lastRealtimeEventAt: getEventTimestamp(event),
    })),
    joinOrderRoom: (orderId) => set((state) => {
        const normalizedOrderId = normalizeOrderId(orderId);
        if (!normalizedOrderId || state.activeOrderRooms.includes(normalizedOrderId)) {
            return state;
        }
        return {
            activeOrderRooms: [...state.activeOrderRooms, normalizedOrderId],
        };
    }),
    leaveOrderRoom: (orderId) => set((state) => {
        const normalizedOrderId = normalizeOrderId(orderId);
        return {
            activeOrderRooms: state.activeOrderRooms.filter((activeOrderId) => activeOrderId !== normalizedOrderId),
        };
    }),
    clearRealtimeOrderState: () => set({
        socketConnected: false,
        connectionState: 'idle',
        activeOrderRooms: [],
        realtimeOrderEvents: [],
        deliveryTrackingEvents: [],
        lastRealtimeEventAt: null,
        connectionError: null,
    }),
}));
