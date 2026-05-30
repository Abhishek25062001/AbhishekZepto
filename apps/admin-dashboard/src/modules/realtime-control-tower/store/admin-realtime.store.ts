import { create } from 'zustand';

import type {
  AdminDeliveryRealtimeEvent,
  AdminOrderRealtimeEvent,
  AdminSlaRealtimeEvent,
  AdminSocketConnectionState,
} from '../types/control-tower-realtime.types';

type AdminRealtimeStoreState = {
  socketConnected: boolean;
  connectionState: AdminSocketConnectionState;
  activeCityRooms: string[];
  lastOrderEvent: AdminOrderRealtimeEvent | null;
  lastDeliveryEvent: AdminDeliveryRealtimeEvent | null;
  lastSlaEvent: AdminSlaRealtimeEvent | null;
  connectionError: string | null;
  lastRealtimeEventAt: string | null;
  setSocketConnected: (connected: boolean) => void;
  setConnectionState: (connectionState: AdminSocketConnectionState) => void;
  setConnectionError: (connectionError: string | null) => void;
  addCityRoom: (cityId: string) => void;
  removeCityRoom: (cityId: string) => void;
  setLastOrderEvent: (event: AdminOrderRealtimeEvent) => void;
  setLastDeliveryEvent: (event: AdminDeliveryRealtimeEvent) => void;
  setLastSlaEvent: (event: AdminSlaRealtimeEvent) => void;
  clearAdminRealtimeState: () => void;
};

const getEventTimestamp = (
  event:
    | AdminOrderRealtimeEvent
    | AdminDeliveryRealtimeEvent
    | AdminSlaRealtimeEvent,
): string =>
  'breachedAt' in event ? event.breachedAt : event.updatedAt;

export const useAdminRealtimeStore = create<AdminRealtimeStoreState>((set) => ({
  socketConnected: false,
  connectionState: 'idle',
  activeCityRooms: [],
  lastOrderEvent: null,
  lastDeliveryEvent: null,
  lastSlaEvent: null,
  connectionError: null,
  lastRealtimeEventAt: null,
  setSocketConnected: (connected) =>
    set({
      socketConnected: connected,
      connectionState: connected ? 'connected' : 'disconnected',
      ...(connected ? { connectionError: null } : {}),
    }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setConnectionError: (connectionError) =>
    set({
      connectionError,
      ...(connectionError ? { connectionState: 'failed' } : {}),
    }),
  addCityRoom: (cityId) =>
    set((state) => {
      const trimmedCityId = cityId.trim();
      if (!trimmedCityId || state.activeCityRooms.includes(trimmedCityId)) {
        return state;
      }

      return {
        activeCityRooms: [...state.activeCityRooms, trimmedCityId],
      };
    }),
  removeCityRoom: (cityId) =>
    set((state) => ({
      activeCityRooms: state.activeCityRooms.filter(
        (activeCityId) => activeCityId !== cityId.trim(),
      ),
    })),
  setLastOrderEvent: (event) =>
    set({
      lastOrderEvent: event,
      lastRealtimeEventAt: getEventTimestamp(event),
    }),
  setLastDeliveryEvent: (event) =>
    set({
      lastDeliveryEvent: event,
      lastRealtimeEventAt: getEventTimestamp(event),
    }),
  setLastSlaEvent: (event) =>
    set({
      lastSlaEvent: event,
      lastRealtimeEventAt: getEventTimestamp(event),
    }),
  clearAdminRealtimeState: () =>
    set({
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
