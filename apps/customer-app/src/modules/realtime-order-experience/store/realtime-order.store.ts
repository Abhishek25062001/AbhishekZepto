import { create } from 'zustand';

import type {
  CustomerOrderRealtimeEvent,
  DeliveryTrackingRealtimeEvent,
  RealtimeSocketConnectionState,
} from '../types/realtime-order.types';

type RealtimeOrderStoreState = {
  socketConnected: boolean;
  connectionState: RealtimeSocketConnectionState;
  activeOrderRooms: string[];
  realtimeOrderEvents: CustomerOrderRealtimeEvent[];
  deliveryTrackingEvents: DeliveryTrackingRealtimeEvent[];
  lastRealtimeEventAt: string | null;
  connectionError: string | null;
  setSocketConnected: (connected: boolean) => void;
  setConnectionState: (connectionState: RealtimeSocketConnectionState) => void;
  setConnectionError: (connectionError: string | null) => void;
  addRealtimeOrderEvent: (event: CustomerOrderRealtimeEvent) => void;
  addDeliveryTrackingEvent: (event: DeliveryTrackingRealtimeEvent) => void;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  clearRealtimeOrderState: () => void;
};

const normalizeOrderId = (orderId: string): string => orderId.trim();

const getEventTimestamp = (
  event: CustomerOrderRealtimeEvent | DeliveryTrackingRealtimeEvent,
): string => event.emittedAt ?? event.updatedAt ?? new Date().toISOString();

export const useRealtimeOrderStore = create<RealtimeOrderStoreState>((set) => ({
  socketConnected: false,
  connectionState: 'idle',
  activeOrderRooms: [],
  realtimeOrderEvents: [],
  deliveryTrackingEvents: [],
  lastRealtimeEventAt: null,
  connectionError: null,
  setSocketConnected: (connected) =>
    set({
      socketConnected: connected,
      connectionState: connected ? 'connected' : 'disconnected',
      connectionError: connected ? null : undefined,
    }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setConnectionError: (connectionError) => set({ connectionError }),
  addRealtimeOrderEvent: (event) =>
    set((state) => ({
      realtimeOrderEvents: [...state.realtimeOrderEvents, event],
      lastRealtimeEventAt: getEventTimestamp(event),
    })),
  addDeliveryTrackingEvent: (event) =>
    set((state) => ({
      deliveryTrackingEvents: [...state.deliveryTrackingEvents, event],
      lastRealtimeEventAt: getEventTimestamp(event),
    })),
  joinOrderRoom: (orderId) =>
    set((state) => {
      const normalizedOrderId = normalizeOrderId(orderId);
      if (!normalizedOrderId || state.activeOrderRooms.includes(normalizedOrderId)) {
        return state;
      }

      return {
        activeOrderRooms: [...state.activeOrderRooms, normalizedOrderId],
      };
    }),
  leaveOrderRoom: (orderId) =>
    set((state) => {
      const normalizedOrderId = normalizeOrderId(orderId);
      return {
        activeOrderRooms: state.activeOrderRooms.filter(
          (activeOrderId) => activeOrderId !== normalizedOrderId,
        ),
      };
    }),
  clearRealtimeOrderState: () =>
    set({
      socketConnected: false,
      connectionState: 'idle',
      activeOrderRooms: [],
      realtimeOrderEvents: [],
      deliveryTrackingEvents: [],
      lastRealtimeEventAt: null,
      connectionError: null,
    }),
}));
