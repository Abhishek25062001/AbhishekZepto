"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdminRealtimeStore = void 0;
const zustand_1 = require("zustand");
const getEventTimestamp = (event) => 'breachedAt' in event ? event.breachedAt : event.updatedAt;
exports.useAdminRealtimeStore = (0, zustand_1.create)((set) => ({
    socketConnected: false,
    connectionState: 'idle',
    activeCityRooms: [],
    lastOrderEvent: null,
    lastDeliveryEvent: null,
    lastSlaEvent: null,
    connectionError: null,
    lastRealtimeEventAt: null,
    setSocketConnected: (connected) => set({
        socketConnected: connected,
        connectionState: connected ? 'connected' : 'disconnected',
        ...(connected ? { connectionError: null } : {}),
    }),
    setConnectionState: (connectionState) => set({ connectionState }),
    setConnectionError: (connectionError) => set({
        connectionError,
        ...(connectionError ? { connectionState: 'failed' } : {}),
    }),
    addCityRoom: (cityId) => set((state) => {
        const trimmedCityId = cityId.trim();
        if (!trimmedCityId || state.activeCityRooms.includes(trimmedCityId)) {
            return state;
        }
        return {
            activeCityRooms: [...state.activeCityRooms, trimmedCityId],
        };
    }),
    removeCityRoom: (cityId) => set((state) => ({
        activeCityRooms: state.activeCityRooms.filter((activeCityId) => activeCityId !== cityId.trim()),
    })),
    setLastOrderEvent: (event) => set({
        lastOrderEvent: event,
        lastRealtimeEventAt: getEventTimestamp(event),
    }),
    setLastDeliveryEvent: (event) => set({
        lastDeliveryEvent: event,
        lastRealtimeEventAt: getEventTimestamp(event),
    }),
    setLastSlaEvent: (event) => set({
        lastSlaEvent: event,
        lastRealtimeEventAt: getEventTimestamp(event),
    }),
    clearAdminRealtimeState: () => set({
        socketConnected: false,
        connectionState: 'idle',
        activeCityRooms: [],
        lastOrderEvent: null,
        lastDeliveryEvent: null,
        lastSlaEvent: null,
        connectionError: null,
        lastRealtimeEventAt: null,
    }),
}));
