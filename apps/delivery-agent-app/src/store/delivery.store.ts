import { create } from 'zustand';
import type { DeliveryStatus } from '../types/delivery.types';

type AvailabilityStatus = 'offline' | 'online' | 'busy';

type CurrentDeliveryInput = {
  currentOrderId: string | null;
  currentAssignmentId: string | null;
  currentDeliveryStatus: DeliveryStatus | null;
};

type DeliveryStoreState = {
  availabilityStatus: AvailabilityStatus;
  currentOrderId: string | null;
  currentAssignmentId: string | null;
  currentDeliveryStatus: DeliveryStatus | null;
  setAvailabilityStatus: (availabilityStatus: AvailabilityStatus) => void;
  setCurrentDelivery: (currentDelivery: CurrentDeliveryInput) => void;
  setCurrentDeliveryStatus: (status: DeliveryStatus | null) => void;
  clearCurrentDelivery: () => void;
};

export const useDeliveryStore = create<DeliveryStoreState>((set) => ({
  availabilityStatus: 'offline',
  currentOrderId: null,
  currentAssignmentId: null,
  currentDeliveryStatus: null,
  setAvailabilityStatus: (availabilityStatus) => set({ availabilityStatus }),
  setCurrentDelivery: (currentDelivery) => set(currentDelivery),
  setCurrentDeliveryStatus: (status) => set({ currentDeliveryStatus: status }),
  clearCurrentDelivery: () =>
    set({
      currentOrderId: null,
      currentAssignmentId: null,
      currentDeliveryStatus: null,
    }),
}));
