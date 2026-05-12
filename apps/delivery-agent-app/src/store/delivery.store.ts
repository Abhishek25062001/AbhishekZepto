import { create } from 'zustand';

type AvailabilityStatus = 'offline' | 'online' | 'busy';

type CurrentDeliveryInput = {
  currentOrderId: string | null;
  currentAssignmentId: string | null;
  currentDeliveryStatus: string | null;
};

type DeliveryStoreState = {
  availabilityStatus: AvailabilityStatus;
  currentOrderId: string | null;
  currentAssignmentId: string | null;
  currentDeliveryStatus: string | null;
  setAvailabilityStatus: (availabilityStatus: AvailabilityStatus) => void;
  setCurrentDelivery: (currentDelivery: CurrentDeliveryInput) => void;
  clearCurrentDelivery: () => void;
};

export const useDeliveryStore = create<DeliveryStoreState>((set) => ({
  availabilityStatus: 'offline',
  currentOrderId: null,
  currentAssignmentId: null,
  currentDeliveryStatus: null,
  setAvailabilityStatus: (availabilityStatus) => set({ availabilityStatus }),
  setCurrentDelivery: (currentDelivery) => set(currentDelivery),
  clearCurrentDelivery: () =>
    set({
      currentOrderId: null,
      currentAssignmentId: null,
      currentDeliveryStatus: null,
    }),
}));

