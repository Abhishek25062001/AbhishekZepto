import { create } from 'zustand';

import type {
  DeliveryAssignmentRealtimeEvent,
  DeliverySocketConnectionState,
  DeliveryStatusRealtimeEvent,
} from '../types/delivery-realtime.types';

type DeliveryRealtimeStoreState = {
  socketConnected: boolean;
  connectionState: DeliverySocketConnectionState;
  activeAssignmentRooms: string[];
  lastAssignmentEvent: DeliveryAssignmentRealtimeEvent | null;
  lastStatusEvent: DeliveryStatusRealtimeEvent | null;
  lastLocationAckAt: string | null;
  locationSyncPaused: boolean;
  locationSyncError: string | null;
  connectionError: string | null;
  lastRealtimeEventAt: string | null;
  setSocketConnected: (connected: boolean) => void;
  setConnectionState: (connectionState: DeliverySocketConnectionState) => void;
  setConnectionError: (connectionError: string | null) => void;
  addAssignmentRoom: (assignmentId: string) => void;
  removeAssignmentRoom: (assignmentId: string) => void;
  setLastAssignmentEvent: (event: DeliveryAssignmentRealtimeEvent) => void;
  setLastStatusEvent: (event: DeliveryStatusRealtimeEvent) => void;
  setLastLocationAckAt: (lastLocationAckAt: string | null) => void;
  setLocationSyncPaused: (paused: boolean) => void;
  setLocationSyncError: (error: string | null) => void;
  clearDeliveryRealtimeState: () => void;
};

const normalizeAssignmentId = (assignmentId: string): string => assignmentId.trim();

const getRealtimeEventTimestamp = (
  event: DeliveryAssignmentRealtimeEvent | DeliveryStatusRealtimeEvent,
): string => event.emittedAt ?? event.updatedAt ?? new Date().toISOString();

export const useDeliveryRealtimeStore = create<DeliveryRealtimeStoreState>((set) => ({
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
  setSocketConnected: (connected) =>
    set({
      socketConnected: connected,
      connectionState: connected ? 'connected' : 'disconnected',
      connectionError: connected ? null : undefined,
    }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setConnectionError: (connectionError) => set({ connectionError }),
  addAssignmentRoom: (assignmentId) =>
    set((state) => {
      const normalizedAssignmentId = normalizeAssignmentId(assignmentId);
      if (
        !normalizedAssignmentId ||
        state.activeAssignmentRooms.includes(normalizedAssignmentId)
      ) {
        return state;
      }

      return {
        activeAssignmentRooms: [
          ...state.activeAssignmentRooms,
          normalizedAssignmentId,
        ],
      };
    }),
  removeAssignmentRoom: (assignmentId) =>
    set((state) => {
      const normalizedAssignmentId = normalizeAssignmentId(assignmentId);
      return {
        activeAssignmentRooms: state.activeAssignmentRooms.filter(
          (activeAssignmentId) => activeAssignmentId !== normalizedAssignmentId,
        ),
      };
    }),
  setLastAssignmentEvent: (event) =>
    set({
      lastAssignmentEvent: event,
      lastRealtimeEventAt: getRealtimeEventTimestamp(event),
    }),
  setLastStatusEvent: (event) =>
    set((state) => ({
      lastStatusEvent: event,
      lastRealtimeEventAt: getRealtimeEventTimestamp(event),
      lastLocationAckAt:
        event.eventName === 'delivery.location_sync_acknowledged'
          ? getRealtimeEventTimestamp(event)
          : state.lastLocationAckAt,
      locationSyncPaused:
        event.eventName === 'delivery.location_sync_acknowledged'
          ? false
          : state.locationSyncPaused,
      locationSyncError:
        event.eventName === 'delivery.location_sync_acknowledged'
          ? null
          : state.locationSyncError,
    })),
  setLastLocationAckAt: (lastLocationAckAt) => set({ lastLocationAckAt }),
  setLocationSyncPaused: (paused) => set({ locationSyncPaused: paused }),
  setLocationSyncError: (error) => set({ locationSyncError: error }),
  clearDeliveryRealtimeState: () =>
    set({
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
