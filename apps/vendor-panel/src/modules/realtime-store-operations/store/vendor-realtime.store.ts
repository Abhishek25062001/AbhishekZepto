import { create } from 'zustand';

import type {
  VendorOrderRealtimeEvent,
  VendorPickupRealtimeEvent,
  VendorSocketConnectionState,
} from '../types/vendor-realtime.types';

type VendorRealtimeStoreState = {
  socketConnected: boolean;
  connectionState: VendorSocketConnectionState;
  activeOrderRooms: string[];
  lastOrderEvent: VendorOrderRealtimeEvent | null;
  lastPickupEvent: VendorPickupRealtimeEvent | null;
  connectionError: string | null;
  lastRealtimeEventAt: string | null;
  setSocketConnected: (connected: boolean) => void;
  setConnectionState: (connectionState: VendorSocketConnectionState) => void;
  setConnectionError: (connectionError: string | null) => void;
  addOrderRoom: (orderId: string) => void;
  removeOrderRoom: (orderId: string) => void;
  setLastOrderEvent: (event: VendorOrderRealtimeEvent) => void;
  setLastPickupEvent: (event: VendorPickupRealtimeEvent) => void;
  clearVendorRealtimeState: () => void;
};

const normalizeOrderId = (orderId: string): string => orderId.trim();

const getRealtimeEventTimestamp = (
  event: VendorOrderRealtimeEvent | VendorPickupRealtimeEvent,
): string => event.emittedAt ?? event.updatedAt ?? new Date().toISOString();

export const useVendorRealtimeStore = create<VendorRealtimeStoreState>((set) => ({
  socketConnected: false,
  connectionState: 'idle',
  activeOrderRooms: [],
  lastOrderEvent: null,
  lastPickupEvent: null,
  connectionError: null,
  lastRealtimeEventAt: null,
  setSocketConnected: (connected) =>
    set({
      socketConnected: connected,
      connectionState: connected ? 'connected' : 'disconnected',
      connectionError: connected ? null : undefined,
    }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setConnectionError: (connectionError) => set({ connectionError }),
  addOrderRoom: (orderId) =>
    set((state) => {
      const normalizedOrderId = normalizeOrderId(orderId);
      if (!normalizedOrderId || state.activeOrderRooms.includes(normalizedOrderId)) {
        return state;
      }

      return {
        activeOrderRooms: [...state.activeOrderRooms, normalizedOrderId],
      };
    }),
  removeOrderRoom: (orderId) =>
    set((state) => {
      const normalizedOrderId = normalizeOrderId(orderId);
      return {
        activeOrderRooms: state.activeOrderRooms.filter(
          (activeOrderId) => activeOrderId !== normalizedOrderId,
        ),
      };
    }),
  setLastOrderEvent: (event) =>
    set({
      lastOrderEvent: event,
      lastRealtimeEventAt: getRealtimeEventTimestamp(event),
    }),
  setLastPickupEvent: (event) =>
    set({
      lastPickupEvent: event,
      lastRealtimeEventAt: getRealtimeEventTimestamp(event),
    }),
  clearVendorRealtimeState: () =>
    set({
      socketConnected: false,
      connectionState: 'idle',
      activeOrderRooms: [],
      lastOrderEvent: null,
      lastPickupEvent: null,
      connectionError: null,
      lastRealtimeEventAt: null,
    }),
}));

